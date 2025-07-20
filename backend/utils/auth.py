import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "your-secret"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_token(data: dict):
    payload = data.copy()
    payload.update({"exp": datetime.utcnow() + timedelta(days=3)})
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token: str = Depends(oauth2_scheme)):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
