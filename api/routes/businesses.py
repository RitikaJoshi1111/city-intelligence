from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.database import get_db
from api.schemas import BusinessResponse
from database.models import Business

from api.services import business_service

router = APIRouter()


# ==========================
# Get All Businesses
# ==========================

@router.get("/businesses", response_model=list[BusinessResponse])
def get_businesses(db: Session = Depends(get_db)):
    return business_service.get_all_businesses(db)


# ==========================
# Get Featured Businesses
# ==========================

@router.get("/featured", response_model=list[BusinessResponse])
def get_featured_businesses(db: Session = Depends(get_db)):
    return business_service.get_featured_businesses(db)


# ==========================
# Get Single Business
# ==========================

@router.get("/businesses/{business_id}", response_model=BusinessResponse)
def get_business(
    business_id: int,
    db: Session = Depends(get_db)
):
    business = business_service.get_business_by_id(
        db,
        business_id
    )

    if business is None:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    return business