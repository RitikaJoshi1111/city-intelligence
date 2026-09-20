import pandas as pd


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove duplicate businesses.
    Priority:
    1. Google Maps URL
    2. Business Name + Address
    """

    before = len(df)

    if "google_maps_url" in df.columns:
        df = df.drop_duplicates(subset=["google_maps_url"])

    if "business_name" in df.columns and "address" in df.columns:
        df = df.drop_duplicates(subset=["business_name", "address"])

    after = len(df)

    print(f"Removed {before - after} duplicate records.")

    return df.reset_index(drop=True)