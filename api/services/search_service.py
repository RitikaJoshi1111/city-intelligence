from sqlalchemy.orm import Session
from sqlalchemy import or_

from database.models import Business


def search_businesses(db: Session, query: str):
    businesses = (
        db.query(Business)
        .filter(
            or_(
                Business.business_name.ilike(f"%{query}%"),
                Business.category.ilike(f"%{query}%"),
                Business.industry.ilike(f"%{query}%"),
                Business.address.ilike(f"%{query}%")
            )
        )
        .all()
    )

    for b in businesses:
        print(
            b.id,
            b.business_name,
            b.address
        )

    return businesses

def filter_businesses(db: Session, industry: str):
    if industry == "All":
        return db.query(Business).all()

    return (
        db.query(Business)
        .filter(Business.industry == industry)
        .all()
    )


def get_industries(db: Session):
    industries = (
        db.query(Business.industry)
        .distinct()
        .order_by(Business.industry)
        .all()
    )

    return [industry[0] for industry in industries if industry[0]]