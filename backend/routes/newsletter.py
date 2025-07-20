from fastapi import APIRouter,status, HTTPException
from models.newsletter import newsletter
from db.mongo import db
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/newsletter")

@router.post("/subscribe")
async def add_newsletter(subscriber: newsletter):
    exists = await db.newsletter.find_one({"email": subscriber.email})
    print(f"Lead Result : {exists} : {subscriber}")
    if exists:
        return {"status": "failed", "message": "already Exits"}
    ulead_dict = subscriber.dict()
    await db.newsletter.insert_one(ulead_dict)
    return {"status":"success","message": "created sucessfully"}