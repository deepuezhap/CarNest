from fastapi import FastAPI
from database import engine
from models import Base, User, Car  # Ensure Car model is imported
from routes.auth import auth_router
from routes.protected_routes import protected_router
from routes.car import car_router  # Car route already in `routes/`

app = FastAPI()

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Include protected routes
app.include_router(protected_router, prefix="/api", tags=["Protected"])

# Include car routes
app.include_router(car_router, prefix="/cars", tags=["Cars"])

@app.get("/")
def home():
    return {"message": "Welcome to CarNest API"}
