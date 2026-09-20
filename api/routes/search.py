from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.schemas import BusinessResponse
from api.services import search_service

router = APIRouter()


# ==========================
# Universal Search
# ==========================

@router.get("/search", response_model=list[BusinessResponse])
def search_businesses(
    query: str,
    db: Session = Depends(get_db)
):
    return search_service.search_businesses(db, query)


# ==========================
# Filter by Industry
# ==========================

@router.get("/filter", response_model=list[BusinessResponse])
def filter_businesses(
    industry: str,
    db: Session = Depends(get_db)
):
    return search_service.filter_businesses(db, industry)


# ==========================
# Get Industries
# ==========================

@router.get("/industries")
def get_industries(db: Session = Depends(get_db)):
    return search_service.get_industries(db)