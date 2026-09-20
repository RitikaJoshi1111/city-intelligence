from sqlalchemy.orm import Session
from database.models import Business


def get_all_businesses(db: Session):
    return db.query(Business).limit(20).all()


def get_featured_businesses(db: Session):
    return (
        db.query(Business)
        .order_by(Business.rating.desc())
        .limit(6)
        .all()
    )


def get_business_by_id(db: Session, business_id: int):
    return (
        db.query(Business)
        .filter(Business.id == business_id)
        .first()
    )