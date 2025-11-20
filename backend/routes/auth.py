from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin
from db.mongo import db
from passlib.context import CryptContext
from utils.auth import create_token, decode_token
from bson import ObjectId
from fastapi.responses import JSONResponse

# Password hashing context - supports multiple hash types for compatibility
pwd_context = CryptContext(schemes=["bcrypt", "bcrypt_sha256"], deprecated="auto")

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

    # Convert Pydantic model to dict
    user_dict = user.dict()

    # Hash password using bcrypt (standard and compatible)
    user_dict["password"] = pwd_context.hash(user.password)

    user_dict["role"] = "customer"

    await db.users.insert_one(user_dict)

    return {
        "status": "success",
        "message": "User created successfully"
    }


@router.post("/login")
async def login(user: UserLogin):
    found = await db.users.find_one({"email": user.email})

    # Incorrect email
    if not found:
        return {
            "status": "failed",
            "message": "Invalid email or password"
        }
    
    # Verify password - pwd_context can verify multiple hash types
    try:
        if not pwd_context.verify(user.password, found["password"]):
            return {
                "status": "failed",
                "message": "Invalid email or password"
            }
    except Exception as e:
        # If hash format is invalid, return error
        print(f"Password verification error: {e}")
        return {
            "status": "failed",
            "message": "Invalid email or password"
        }

    # Create JWT token
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
        user = await db.users.find_one({"_id": ObjectId(payload["user_id"])}, {"password": 0})
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
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"status": "success", "message": "Logged out successfully"}

