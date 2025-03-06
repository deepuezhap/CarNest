from fastapi import Depends, FastAPI
from auth import auth_router, get_current_user
from database import  engine
from models import Base, User  # Import models here
from protected_routes import protected_router


app = FastAPI()

# Create database tables on startup
Base.metadata.create_all(bind=engine)


# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

app.include_router(protected_router, prefix="/api", tags=["Protected"])

@app.get("/")
def home():
    return {"message": "Welcome to CarNest API"}
