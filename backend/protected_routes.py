from fastapi import APIRouter, Depends
from models import User
from auth import get_current_user

protected_router = APIRouter()

@protected_router.get("/protected")
def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Hello {user.username}, you have access to this protected route!"}
