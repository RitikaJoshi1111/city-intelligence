import pandas as pd

from cleaner.address_cleaner import clean_address
from cleaner.phone_cleaner import clean_phone

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans the dataframe before saving to database.
    """

    # Clean Address
    if "address" in df.columns:
        df["address"] = df["address"].fillna("").apply(clean_address)
        df["phone"] = df["phone"].fillna("").apply(clean_phone)

    # Remove duplicate businesses using Google Maps URL
    if "google_maps_url" in df.columns:
        df = df.drop_duplicates(subset=["google_maps_url"])

    # Remove duplicate Name + Address
    if "business_name" in df.columns and "address" in df.columns:
        df = df.drop_duplicates(subset=["business_name", "address"])

    df = df.reset_index(drop=True)

    return df


def clean_csv(input_file, output_file):

    df = pd.read_csv(input_file)

    df = clean_dataframe(df)

    df.to_csv(output_file, index=False)

    print(f"Cleaning completed. Total records: {len(df)}")