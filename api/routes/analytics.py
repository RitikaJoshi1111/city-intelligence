from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.services import analytics_service

router = APIRouter()


# ==========================
# Dashboard Stats
# ==========================

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_stats(db)


# ==========================
# Complete Analytics
# ==========================

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    return analytics_service.get_analytics_dashboard(db)