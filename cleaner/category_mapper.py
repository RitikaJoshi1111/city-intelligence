import pandas as pd


CATEGORY_MAPPING = {

    "Furniture Store": "Furniture",

    "Furniture Manufacturer": "Furniture",

    "Office Furniture Store": "Furniture",

    "Wood Furniture Shop": "Furniture",

    "Handicraft": "Handicraft",

    "Handicraft Exporter": "Handicraft",

    "Exporter": "Export",

    "Manufacturer": "Manufacturing",

    "Factory": "Manufacturing",

    "Textile Manufacturer": "Textile",

    "IT Company": "Technology",

    "Software Company": "Technology",

    "Transport Company": "Logistics",

    "Logistics Company": "Logistics"

}


def map_category(category: str) -> str:

    if not category:
        return ""

    category = category.strip()

    return CATEGORY_MAPPING.get(category, category)