from fastapi import APIRouter, Depends, HTTPException
from db.mongo import db
from models.bill import BillCreate
from datetime import datetime
from utils.auth import decode_token

router = APIRouter(prefix="/bill")

@router.post("/create")
async def create_bill(data: BillCreate, payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Only admin")
    
    project = await db.projects.find_one({"_id": data.project_id})
    if not project:
        raise HTTPException(404, "Project not found")

    bill = data.dict()
    bill.update({
        "user_id": project["created_by"],
        "issued_on": datetime.utcnow(),
        "status": "unpaid"
    })
    await db.bills.insert_one(bill)
    return {"msg": "Bill created"}

@router.get("/my")
async def get_my_bills(payload=Depends(decode_token)):
    bills = await db.bills.find({"user_id": payload["user_id"]}).to_list(100)
    return bills

@router.get("/all")
async def get_all_bills(payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403)
    bills = await db.bills.find().to_list(100)
    return bills
