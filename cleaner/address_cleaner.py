import re


def clean_address(address: str) -> str:

    if not address:
        return ""

    # Remove Google Maps location icon
    address = address.replace("\ue0c8", "")

    # Replace new lines
    address = address.replace("\n", ", ")

    # Remove duplicate commas
    address = re.sub(r",+", ",", address)

    # Remove extra spaces
    address = re.sub(r"\s+", " ", address)

    # Remove spaces before commas
    address = re.sub(r"\s+,", ",", address)

    return address.strip(" ,")