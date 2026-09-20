from cleaner.address_cleaner import clean_address
from cleaner.category_mapper import map_category
from cleaner.phone_cleaner import clean_phone


def process_record(record):
    """
    Clean a business record before saving.
    """

    # Address
    record.address = clean_address(record.address)

    # Phone
    record.phone = clean_phone(record.phone)

    # Category
    record.category = map_category(record.category)

    return record