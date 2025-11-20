from fastapi import APIRouter, status, HTTPException
from models.user import UserCreate, UserLogin
from db.mongo import db
from passlib.hash import bcrypt_sha256
from utils.auth import create_token
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/auth")

@router.post("/signup")
async def signup(user: UserCreate):
    # Check if user already exists
    exists = await db.users.find_one({"email": user.email})
    print(f"User Result : {exists}")

    if exists:
        return {
            "status": "failed",
            "message": "Email already registered"
        }

    # Convert to dict
    user_dict = user.dict()

    # Hash password safely (no 72-byte limit issue)
    user_dict["password"] = bcrypt_sha256.hash(user.password)

    user_dict["role"] = "customer"
    await db.users.insert_one(user_dict)
    return {"status":"success","message": "User created sucessfully"}

@router.post("/login")
async def login(user: UserLogin):
    found = await db.users.find_one({"email": user.email})
    if not found or not bcrypt.verify(user.password, found["password"]):
        return {"status":"failed","message": "Email not found"}
    token = create_token({"user_id": str(found["_id"]), "role": found["role"]})
    return {"status":"success","token": token}
