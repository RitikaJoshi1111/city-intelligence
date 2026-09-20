from sqlalchemy.orm import Session
from sqlalchemy import func

from database.models import Business


def get_dashboard_stats(db: Session):
    total_businesses = db.query(Business).count()

    total_industries = (
        db.query(func.count(func.distinct(Business.industry)))
        .scalar()
    )

    avg_rating = (
        db.query(func.avg(Business.rating))
        .scalar()
    )

    open_businesses = (
        db.query(Business)
        .filter(Business.status.ilike("%Open%"))
        .count()
    )

    return {
        "businesses": total_businesses,
        "industries": total_industries,
        "rating": round(avg_rating or 0, 1),
        "open": open_businesses,
    }


def get_industry_distribution(db: Session):
    industries = (
        db.query(
            Business.industry,
            func.count(Business.id)
        )
        .group_by(Business.industry)
        .all()
    )

    return [
        {
            "industry": industry,
            "count": count
        }
        for industry, count in industries
    ]


def get_rating_distribution(db: Session):

    return {
        "4-5": db.query(Business)
                 .filter(Business.rating >= 4)
                 .count(),

        "3-4": db.query(Business)
                 .filter(
                     Business.rating >= 3,
                     Business.rating < 4
                 )
                 .count(),

        "Below 3": db.query(Business)
                     .filter(Business.rating < 3)
                     .count()
    }


def get_top_businesses(db: Session):

    businesses = (
        db.query(Business)
        .order_by(Business.rating.desc())
        .limit(5)
        .all()
    )

    return businesses

def get_analytics_dashboard(db: Session):
    return {
        "summary": get_dashboard_stats(db),
        "industry_distribution": get_industry_distribution(db),
        "rating_distribution": get_rating_distribution(db),
        "top_businesses": get_top_businesses(db),
    }