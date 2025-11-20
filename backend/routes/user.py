from fastapi import APIRouter, Depends, HTTPException
from utils.auth import decode_token
from db.mongo import db
from bson import ObjectId

router = APIRouter(prefix="/user")

@router.get("/me")
async def get_me(payload=Depends(decode_token)):
    user = await db.users.find_one({"_id": ObjectId(payload["user_id"])}, {"password": 0})
    if not user:
        raise HTTPException(404, "User not found")
    user["id"] = str(user["_id"])
    return user

@router.get("/details/{id}")
async def get_user_by_id(id: str, payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Admin only")
    try:
        user = await db.users.find_one({"_id": ObjectId(id)}, {"password": 0})
        if not user:
            raise HTTPException(404, "User not found")
        user["id"] = str(user["_id"])
        return user
    except Exception:
        raise HTTPException(404, "Invalid user ID")

@router.get("/all")
async def get_all_users(payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Admin only")
    users = await db.users.find({}, {"password": 0}).to_list(100)
    for u in users:
        u["id"] = str(u["_id"])
    return users

