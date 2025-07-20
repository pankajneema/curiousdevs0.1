from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Phase(BaseModel):
    name: str
    status: str
    completed_on: Optional[datetime] = None

class ProjectCreate(BaseModel):
    title: str
    description: str

class ProjectOut(ProjectCreate):
    id: str
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    phases: List[Phase]
