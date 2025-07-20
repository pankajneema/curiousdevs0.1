from fastapi import APIRouter,status, HTTPException
from models.lead import leadCreate
from db.mongo import db
from passlib.hash import bcrypt
from utils.auth import create_token
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/lead")

@router.post("/create")
async def lead_create(lead: leadCreate):
    exists = await db.leads.find_one({"email": lead.email,"mobile":lead.mobile})
    print(f"Lead Result : {exists} : {lead}")
    if exists:
        return {"status": "failed", "message": "Lead already Exits"}
    ulead_dict = lead.dict()
    await db.leads.insert_one(ulead_dict)
    return {"status":"success","message": "Lead created sucessfully"}