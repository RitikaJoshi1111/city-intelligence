import re


def clean_phone(phone: str) -> str:

    if not phone:
        return ""

    # Remove Google Maps phone icon
    phone = phone.replace("\ue0b0", "")

    # Keep only digits and +
    phone = re.sub(r"[^\d+]", "", phone)

    return phone