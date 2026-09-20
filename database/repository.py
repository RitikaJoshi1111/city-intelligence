from sqlalchemy import or_, func

from database.db import SessionLocal
from database.models import Business


class BusinessRepository:

    def __init__(self):
        self.db = SessionLocal()

    def save(self, record):

        # Check if business already exists
        existing = self.db.query(Business).filter(
            or_(
                Business.google_maps_url == record.google_maps_url,
                (
                    (func.lower(Business.business_name) == record.business_name.lower()) &
                    (Business.address == record.address)
                )
            )
        ).first()

        record.business_name = (record.business_name or "").strip()
        record.address = (record.address or "").strip()
        record.google_maps_url = (record.google_maps_url or "").strip()

        if existing:
            print(f"Skipping duplicate: {record.business_name}")
            return

        business = Business(

            industry=record.industry,
            subcategory=record.subcategory,
            search_query=record.search_query,

            business_name=record.business_name,
            category=record.category,

            address=record.address,

            latitude=record.latitude,
            longitude=record.longitude,

            phone=record.phone,
            website=record.website,

            rating=record.rating,
            review_count=record.review_count,

            description=record.description,

            opening_hours=record.opening_hours,

            status=record.status,

            google_maps_url=record.google_maps_url,

            scraped_at=record.scraped_at
        )

        self.db.add(business)
        self.db.commit()

        print(f"Saved: {record.business_name}")

    def close(self):
        self.db.close()