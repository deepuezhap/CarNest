from fastapi import FastAPI
from database import engine
from models import Base, User, Car  # Ensure Car model is imported
from routes.auth import auth_router
from routes.protected_routes import protected_router
from routes.car import car_router  # Car route already in `routes/`
from fastapi.middleware.cors import CORSMiddleware
import time
from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Allow frontend to communicate with backend
origins = [
    "http://localhost:5173"  # React Vite Dev Server
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Include protected routes
app.include_router(protected_router, prefix="/api", tags=["Protected"])

# Include car routes
app.include_router(car_router, prefix="/cars", tags=["Cars"])

# Serve images from the "images" folder
app.mount("/images", StaticFiles(directory="./images/"), name="images")

@app.get("/")
def home():
    time.sleep(3)  # Simulate a 3-second delay
    return {"message": "Welcome to CarNest API"}
