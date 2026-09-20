from api.routes import businesses
from api.routes import search
from api.routes import analytics

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from typing import Optional

from api.database import get_db
from database.models import Business
from api.schemas import BusinessResponse

app = FastAPI(
    title="City Intelligence API",
    version="1.0.0"
)

# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(businesses.router)
app.include_router(search.router)
app.include_router(analytics.router)

# ==========================
# Home
# ==========================

@app.get("/")
def home():
    return {
        "message": "City Intelligence API is running"
    }

