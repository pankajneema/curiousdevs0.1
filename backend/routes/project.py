from fastapi import APIRouter, Depends
from db.mongo import db
from models.project import ProjectCreate
from datetime import datetime
from utils.auth import decode_token

router = APIRouter(prefix="/project")

@router.post("/create")
async def create_project(data: ProjectCreate, payload=Depends(decode_token)):
    project = data.dict()
    project.update({
        "created_by": payload["user_id"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "in_progress",
        "phases": [
            {"name": "Requirement", "status": "completed", "completed_on": datetime.utcnow()},
            {"name": "Design", "status": "pending"},
            {"name": "Development", "status": "pending"}
        ]
    })
    await db.projects.insert_one(project)
    return {"msg": "Project created"}

@router.get("/all")
async def get_all(payload=Depends(decode_token)):
    if payload["role"] == "admin":
        projs = await db.projects.find().to_list(100)
    else:
        projs = await db.projects.find({"created_by": payload["user_id"]}).to_list(100)
    return projs

@router.get("/details/{id}")
async def project_details(id: str, payload=Depends(decode_token)):
    proj = await db.projects.find_one({"_id": id})
    if not proj:
        return {"error": "Not found"}
    if payload["role"] != "admin" and proj["created_by"] != payload["user_id"]:
        return {"error": "Unauthorized"}
    proj["id"] = str(proj["_id"])
    return proj
