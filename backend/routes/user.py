from fastapi import APIRouter, Depends, HTTPException
from utils.auth import decode_token
from db.mongo import db

router = APIRouter(prefix="/user")

@router.get("/me")
async def get_me(payload=Depends(decode_token)):
    user = await db.users.find_one({"_id": payload["user_id"]}, {"password": 0})
    if not user:
        raise HTTPException(404, "User not found")
    user["id"] = str(user["_id"])
    return user

@router.get("/details/{id}")
async def get_user_by_id(id: str, payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Admin only")
    user = await db.users.find_one({"_id": id}, {"password": 0})
    if not user:
        raise HTTPException(404, "User not found")
    user["id"] = str(user["_id"])
    return user

@router.get("/all")
async def get_all_users(payload=Depends(decode_token)):
    if payload["role"] != "admin":
        raise HTTPException(403, "Admin only")
    users = await db.users.find().to_list(100)
    return [{"id": str(u["_id"]), "name": u["name"], "email": u["email"], "role": u["role"]} for u in users]


@router.post("/create")
async def createUsers(payload=Depends(decode_token)):
    if payload:
        users = await db.users.find().to_list(100)

