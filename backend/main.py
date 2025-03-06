from fastapi import FastAPI
from auth import auth_router
from database import  engine
from models import Base  # Import models here

app = FastAPI()

# Create database tables on startup
Base.metadata.create_all(bind=engine)


# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def home():
    return {"message": "Welcome to CarNest API"}
