from sqlalchemy import Column
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime

from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Business(Base):

    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)

    industry = Column(String(100))
    subcategory = Column(String(150))
    search_query = Column(Text)

    business_name = Column(Text)
    category = Column(Text)

    address = Column(Text)

    latitude = Column(Float)
    longitude = Column(Float)

    phone = Column(Text)
    website = Column(Text)

    rating = Column(Float)
    review_count = Column(Integer)

    description = Column(Text)

    opening_hours = Column(Text)

    status = Column(Text)

    google_maps_url = Column(Text)

    scraped_at = Column(DateTime)