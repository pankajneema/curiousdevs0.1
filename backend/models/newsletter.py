from pydantic import BaseModel,EmailStr

class newsletter(BaseModel):
    email: EmailStr