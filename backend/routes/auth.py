from fastapi import APIRouter
from models.user import UserCreate, UserLogin
from db.mongo import db
from passlib.hash import pbkdf2_sha256
from utils.auth import create_token

router = APIRouter(prefix="/auth")

@router.post("/signup")
async def signup(user: UserCreate):
    exists = await db.users.find_one({"email": user.email})

    if exists:
        return {"status": "failed", "message": "Email already registered"}

    user_dict = user.dict()

    # Use PBKDF2-SHA256 (bcrypt removed)
    user_dict["password"] = pbkdf2_sha256.hash(user.password)
    user_dict["role"] = "customer"

    await db.users.insert_one(user_dict)
    return {"status": "success", "message": "User created successfully"}


@router.post("/login")
async def login(user: UserLogin):
    found = await db.users.find_one({"email": user.email})

    if not found:
        return {"status": "failed", "message": "Invalid email or password"}

    if not pbkdf2_sha256.verify(user.password, found["password"]):
        return {"status": "failed", "message": "Invalid email or password"}

    token = create_token({
        "user_id": str(found["_id"]),
        "role": found["role"],
    })

    return {"status": "success", "token": token}
