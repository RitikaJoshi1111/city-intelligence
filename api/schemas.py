from pydantic import BaseModel
from typing import Optional


class BusinessResponse(BaseModel):

    id: int

    business_name: str
    category: str

    address: str

    latitude: Optional[float]
    longitude: Optional[float]

    phone: Optional[str]
    website: Optional[str]

    rating: Optional[float]
    review_count: Optional[int]

    status: Optional[str]

    class Config:
        from_attributes = True