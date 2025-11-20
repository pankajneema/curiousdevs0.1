from fastapi import APIRouter, Depends, HTTPException
from db.mongo import db
from models.bill import BillCreate
from datetime import datetime
from utils.auth import decode_token
from bson import ObjectId

router = APIRouter(prefix="/bill")

@router.post("/create")
async def create_bill(data: BillCreate, payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Only admin")
    
    try:
        project = await db.projects.find_one({"_id": ObjectId(data.project_id)})
        if not project:
            raise HTTPException(404, "Project not found")

        bill = data.dict()
        bill.update({
            "project_id": ObjectId(data.project_id),
            "user_id": ObjectId(project["created_by"]) if isinstance(project["created_by"], str) else project["created_by"],
            "issued_on": datetime.utcnow(),
            "status": "unpaid"
        })
        result = await db.bills.insert_one(bill)
        bill["id"] = str(result.inserted_id)
        return {"status": "success", "message": "Bill created", "bill": bill}
    except Exception as e:
        raise HTTPException(400, detail=str(e))

@router.get("/my")
async def get_my_bills(payload=Depends(decode_token)):
    bills = await db.bills.find({"user_id": ObjectId(payload["user_id"])}).sort("issued_on", -1).to_list(100)
    for bill in bills:
        bill["id"] = str(bill["_id"])
        bill["project_id"] = str(bill["project_id"])
        bill["user_id"] = str(bill["user_id"])
        if "issued_on" in bill and isinstance(bill["issued_on"], datetime):
            bill["issued_on"] = bill["issued_on"].isoformat()
        if "due_date" in bill and isinstance(bill["due_date"], datetime):
            bill["due_date"] = bill["due_date"].isoformat()
    return bills

@router.get("/all")
async def get_all_bills(payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Admin only")
    bills = await db.bills.find().sort("issued_on", -1).to_list(100)
    for bill in bills:
        bill["id"] = str(bill["_id"])
        bill["project_id"] = str(bill["project_id"])
        bill["user_id"] = str(bill["user_id"])
        if "issued_on" in bill and isinstance(bill["issued_on"], datetime):
            bill["issued_on"] = bill["issued_on"].isoformat()
        if "due_date" in bill and isinstance(bill["due_date"], datetime):
            bill["due_date"] = bill["due_date"].isoformat()
    return bills

@router.put("/payment/{bill_id}")
async def update_payment_status(bill_id: str, payload=Depends(decode_token)):
    """Mark bill as paid"""
    try:
        bill = await db.bills.find_one({"_id": ObjectId(bill_id)})
        if not bill:
            raise HTTPException(404, "Bill not found")
        
        # User can mark their own bill as paid, or admin can mark any bill
        if payload["role"] != "admin" and str(bill["user_id"]) != payload["user_id"]:
            raise HTTPException(403, "Unauthorized")
        
        await db.bills.update_one(
            {"_id": ObjectId(bill_id)},
            {"$set": {"status": "paid", "paid_on": datetime.utcnow()}}
        )
        
        # Update project payment status
        project = await db.projects.find_one({"_id": bill["project_id"]})
        if project:
            await db.projects.update_one(
                {"_id": bill["project_id"]},
                {"$set": {"payment_status": "paid"}}
            )
        
        return {"status": "success", "message": "Payment status updated"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(400, detail=str(e))
