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
    service_type: Optional[str] = "other"
    project_amount: Optional[float] = 0.0

class ProjectUpdate(BaseModel):
    status: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    project_lead_id: Optional[str] = None
    assigned_team: Optional[List[str]] = None
    progress_percentage: Optional[int] = None
    demo_link: Optional[str] = None
    payment_link: Optional[str] = None
    payment_status: Optional[str] = None
    phases: Optional[List[Phase]] = None
    project_amount: Optional[float] = None
    paid_amount: Optional[float] = None

class MessageCreate(BaseModel):
    project_id: str
    message: str
    sender_id: str

class ProjectOut(ProjectCreate):
    id: str
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    phases: List[Phase]
    tech_stack: Optional[List[str]] = []
    project_lead_id: Optional[str] = None
    assigned_team: Optional[List[str]] = []
    progress_percentage: Optional[int] = 0
    demo_link: Optional[str] = None
    payment_link: Optional[str] = None
    payment_status: Optional[str] = "unpaid"
    project_amount: Optional[float] = 0.0
    paid_amount: Optional[float] = 0.0
