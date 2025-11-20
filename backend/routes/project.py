from fastapi import APIRouter, Depends, HTTPException
from db.mongo import db
from models.project import ProjectCreate, ProjectUpdate, MessageCreate
from datetime import datetime
from utils.auth import decode_token
from bson import ObjectId

router = APIRouter(prefix="/project")

def serialize_project(project):
    """Serialize MongoDB project document"""
    if not project:
        return None
    
    # Create a new dict to avoid modifying original
    serialized = dict(project)
    
    # Convert _id to id and string
    if "_id" in serialized:
        serialized["id"] = str(serialized["_id"])
        del serialized["_id"]
    
    # Convert all ObjectId fields to strings
    for key, value in serialized.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, list):
            serialized[key] = [str(item) if isinstance(item, ObjectId) else item for item in value]
    
    # Convert created_by to string if it exists
    if "created_by" in serialized:
        serialized["created_by"] = str(serialized["created_by"])
    
    # Convert project_lead_id to string if it exists
    if "project_lead_id" in serialized and serialized["project_lead_id"]:
        serialized["project_lead_id"] = str(serialized["project_lead_id"])
    
    # Convert assigned_team list items to strings
    if "assigned_team" in serialized and serialized["assigned_team"]:
        serialized["assigned_team"] = [str(member) if not isinstance(member, str) else member for member in serialized["assigned_team"]]
    
    # Convert datetime to ISO string
    for key in ["created_at", "updated_at"]:
        if key in serialized and isinstance(serialized[key], datetime):
            serialized[key] = serialized[key].isoformat()
    
    # Convert phase datetimes
    if "phases" in serialized and isinstance(serialized["phases"], list):
        for phase in serialized["phases"]:
            if isinstance(phase, dict) and "completed_on" in phase and isinstance(phase["completed_on"], datetime):
                phase["completed_on"] = phase["completed_on"].isoformat()
    
    return serialized

@router.post("/create")
async def create_project(data: ProjectCreate, payload=Depends(decode_token)):
    project = data.dict()
    project.update({
        "created_by": payload["user_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "pending",  # Start with pending
        "progress_percentage": 0,
        "payment_status": "unpaid",
        "project_amount": project.get("project_amount", 0.0),
        "paid_amount": 0.0,
        "tech_stack": [],
        "assigned_team": [],
        "phases": [
            {"name": "Requirement", "status": "pending", "completed_on": None},
            {"name": "Design", "status": "pending", "completed_on": None},
            {"name": "Development", "status": "pending", "completed_on": None},
            {"name": "Testing", "status": "pending", "completed_on": None},
            {"name": "Deployment", "status": "pending", "completed_on": None}
        ]
    })
    result = await db.projects.insert_one(project)
    
    # Fetch the created project from database to get proper _id
    created_project = await db.projects.find_one({"_id": result.inserted_id})
    
    if not created_project:
        raise HTTPException(status_code=500, detail="Failed to create project")
    
    serialized_project = serialize_project(created_project)
    
    return {"status": "success", "message": "Project created successfully", "project": serialized_project}

@router.get("/all")
async def get_all(payload=Depends(decode_token)):
    try:
        if payload["role"] == "admin":
            projs = await db.projects.find().sort("created_at", -1).to_list(100)
        else:
            # For customer, filter by their user_id (try both string and ObjectId)
            user_id = payload["user_id"]
            # Try to find projects where created_by matches user_id (as string or ObjectId)
            projs = await db.projects.find({
                "$or": [
                    {"created_by": user_id},
                    {"created_by": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id}
                ]
            }).sort("created_at", -1).to_list(100)
        
        # Serialize all projects
        serialized_projects = []
        for proj in projs:
            serialized = serialize_project(proj)
            if serialized:
                serialized_projects.append(serialized)
        
        return serialized_projects
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []

@router.get("/details/{id}")
async def project_details(id: str, payload=Depends(decode_token)):
    try:
        proj = await db.projects.find_one({"_id": ObjectId(id)})
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check authorization
        if payload["role"] != "admin" and str(proj.get("created_by")) != payload["user_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        return serialize_project(proj)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail="Invalid project ID")

@router.post("/payment/{id}")
async def process_payment(id: str, payload=Depends(decode_token)):
    """Process payment for a project (dummy payment)"""
    try:
        proj = await db.projects.find_one({"_id": ObjectId(id)})
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check authorization - user must be creator
        if payload["role"] != "admin" and str(proj.get("created_by")) != payload["user_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        project_amount = proj.get("project_amount", 0.0)
        paid_amount = proj.get("paid_amount", 0.0)
        remaining = project_amount - paid_amount
        
        if remaining <= 0:
            return {"status": "success", "message": "Project already fully paid"}
        
        # Dummy payment - mark as paid
        new_paid = project_amount  # Pay full amount
        
        await db.projects.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "paid_amount": new_paid,
                "payment_status": "paid",
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Create bill entry
        bill_data = {
            "project_id": ObjectId(id),
            "user_id": ObjectId(proj["created_by"]) if isinstance(proj["created_by"], str) else proj["created_by"],
            "amount": remaining,
            "issued_on": datetime.utcnow(),
            "paid_on": datetime.utcnow(),
            "status": "paid"
        }
        await db.bills.insert_one(bill_data)
        
        return {
            "status": "success",
            "message": "Payment processed successfully",
            "paid_amount": remaining
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/update/{id}")
async def update_project(id: str, data: ProjectUpdate, payload=Depends(decode_token)):
    """Update project (admin only or project creator)"""
    try:
        proj = await db.projects.find_one({"_id": ObjectId(id)})
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check authorization - admin or creator can update
        if payload["role"] != "admin" and str(proj.get("created_by")) != payload["user_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        update_data = data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        # Calculate progress from phases if provided
        if "phases" in update_data:
            # Convert phase dates from string to datetime if needed
            for phase in update_data["phases"]:
                if phase.get("status") == "completed":
                    if phase.get("completed_on"):
                        if isinstance(phase["completed_on"], str):
                            try:
                                # Parse date string (format: YYYY-MM-DD) to datetime
                                date_str = phase["completed_on"]
                                if "T" in date_str:
                                    phase["completed_on"] = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                                else:
                                    # Parse YYYY-MM-DD format
                                    date_parts = date_str.split("-")
                                    if len(date_parts) == 3:
                                        phase["completed_on"] = datetime(
                                            int(date_parts[0]),
                                            int(date_parts[1]),
                                            int(date_parts[2])
                                        )
                                    else:
                                        phase["completed_on"] = datetime.utcnow()
                            except:
                                # If parsing fails, use current datetime
                                phase["completed_on"] = datetime.utcnow()
                    else:
                        # If status is completed but no date, use current datetime
                        phase["completed_on"] = datetime.utcnow()
                else:
                    # If status is not completed, remove completion date
                    phase["completed_on"] = None
            
            completed_phases = sum(1 for p in update_data["phases"] if p.get("status") == "completed")
            total_phases = len(update_data["phases"])
            update_data["progress_percentage"] = int((completed_phases / total_phases) * 100) if total_phases > 0 else 0
        
        await db.projects.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        
        updated_proj = await db.projects.find_one({"_id": ObjectId(id)})
        serialized_project = serialize_project(updated_proj)
        return {"status": "success", "message": "Project updated", "project": serialized_project}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/message")
async def send_message(data: MessageCreate, payload=Depends(decode_token)):
    """Send message to project lead"""
    try:
        proj = await db.projects.find_one({"_id": ObjectId(data.project_id)})
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check authorization - user must be creator or admin
        if payload["role"] != "admin" and str(proj.get("created_by")) != payload["user_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        message = {
            "project_id": ObjectId(data.project_id),
            "sender_id": ObjectId(payload["user_id"]),
            "message": data.message,
            "created_at": datetime.utcnow(),
            "read": False
        }
        
        await db.messages.insert_one(message)
        return {"status": "success", "message": "Message sent successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/messages/{project_id}")
async def get_messages(project_id: str, payload=Depends(decode_token)):
    """Get messages for a project"""
    try:
        proj = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not proj:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Check authorization
        if payload["role"] != "admin" and str(proj.get("created_by")) != payload["user_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        messages = await db.messages.find({"project_id": ObjectId(project_id)}).sort("created_at", -1).to_list(100)
        for msg in messages:
            msg["id"] = str(msg["_id"])
            msg["sender_id"] = str(msg["sender_id"])
            msg["project_id"] = str(msg["project_id"])
            if "created_at" in msg and isinstance(msg["created_at"], datetime):
                msg["created_at"] = msg["created_at"].isoformat()
        
        return messages
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=400, detail=str(e))
