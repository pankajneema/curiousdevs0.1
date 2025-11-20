from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime

class leadCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    project: str
    project_type: str
    project_details: str