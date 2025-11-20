from fastapi import APIRouter, status, HTTPException
from models.lead import leadCreate
from db.mongo import db
from datetime import datetime
from utils.email import send_lead_notification
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/lead")

@router.post("/create")
async def lead_create(lead: leadCreate):
    exists = await db.leads.find_one({"email": lead.email, "mobile": lead.mobile})
    if exists:
        return {"status": "failed", "message": "Lead already Exits"}
    
    ulead_dict = lead.dict()
    ulead_dict["created_at"] = datetime.utcnow()
    
    await db.leads.insert_one(ulead_dict)
    
    # Send email notification
    await send_lead_notification(ulead_dict)
    
    return {"status": "success", "message": "Lead created successfully"}

@router.get("/all")
async def get_all_leads():
    """Get all leads (admin only - add auth if needed)"""
    leads = await db.leads.find().sort("created_at", -1).to_list(100)
    for lead in leads:
        lead["id"] = str(lead["_id"])
        if "created_at" in lead and isinstance(lead["created_at"], datetime):
            lead["created_at"] = lead["created_at"].isoformat()
    return leads