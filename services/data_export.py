import pandas as pd

from database.db import SessionLocal
from database.models import Business


def export_database():

    db = SessionLocal()

    rows = db.query(Business).all()

    data = []

    for row in rows:

        data.append(row.__dict__)

    df = pd.DataFrame(data)

    df.drop(columns=["_sa_instance_state"], inplace=True)

    df.to_csv("output/raw/businesses.csv", index=False)

    db.close()

    print("Database Exported")