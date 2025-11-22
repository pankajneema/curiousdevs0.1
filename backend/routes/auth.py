from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin
from db.mongo import db
from passlib.hash import pbkdf2_sha256
from utils.auth import create_token, decode_token
from bson import ObjectId

router = APIRouter(prefix="/auth")

@router.post("/signup")
async def signup(user: UserCreate):
    # Check if user already exists
    exists = await db.users.find_one({"email": user.email})

    if exists:
        return {
            "status": "failed",
            "message": "Email already registered"
        }

    user_dict = user.dict()

    # Hash password using PBKDF2 (best for cross-platform)
    user_dict["password"] = pbkdf2_sha256.hash(user.password)

    user_dict["role"] = "customer"

    await db.users.insert_one(user_dict)

    return {
        "status": "success",
        "message": "User created successfully"
    }


@router.post("/login")
async def login(user: UserLogin):
    found = await db.users.find_one({"email": user.email})

    if not found:
        return {
            "status": "failed",
            "message": "Invalid email or password"
        }

    try:
        if not pbkdf2_sha256.verify(user.password, found["password"]):
            return {
                "status": "failed",
                "message": "Invalid email or password"
            }
    except Exception as e:
        print("Password verify error:", e)
        return {
            "status": "failed",
            "message": "Invalid email or password"
        }

    token = create_token({
        "user_id": str(found["_id"]),
        "role": found["role"]
    })

    return {
        "status": "success",
        "token": token,
        "user": {
            "id": str(found["_id"]),
            "email": found["email"],
            "full_name": found.get("full_name", ""),
            "role": found["role"]
        }
    }


@router.get("/me")
async def get_current_user(payload = Depends(decode_token)):
    """Get current authenticated user"""
    try:
        user = await db.users.find_one(
            {"_id": ObjectId(payload["user_id"])},
            {"password": 0}
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user["id"] = str(user["_id"])

        return {
            "id": user["id"],
            "email": user.get("email", ""),
            "full_name": user.get("full_name", user.get("name", "")),
            "phone": user.get("phone", ""),
            "location": user.get("location", ""),
            "role": user.get("role", "customer")
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/logout")
async def logout():
    return {"status": "success", "message": "Logged out successfully"}
