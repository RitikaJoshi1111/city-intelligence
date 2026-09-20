from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class BusinessRecord:

    # Search Metadata
    industry: str = ""
    subcategory: str = ""
    search_query: str = ""
    scraped_at: Optional[datetime] = None

    # Business Details
    business_name: str = ""
    category: str = ""
    address: str = ""

    # Contact
    phone: str = ""
    website: str = ""

    # Ratings
    rating: Optional[float] = None
    review_count: Optional[int] = None

    # Location
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    google_maps_url: str = ""

    # Extra Information
    description: str = ""
    opening_hours: str = ""
    status: str = ""