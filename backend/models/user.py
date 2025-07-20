from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone:str 
    location:str
    password: str

class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str