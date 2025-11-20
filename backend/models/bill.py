from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BillCreate(BaseModel):
    project_id: str
    amount: float
    due_date: datetime

class BillOut(BillCreate):
    id: str
    user_id: str
    status: str
    issued_on: datetime
