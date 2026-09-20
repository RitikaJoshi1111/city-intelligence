import pandas as pd

CITY = "Jodhpur"

df = pd.read_csv("data/industry_taxonomy.csv")

queries = []

for _, row in df.iterrows():

    queries.append(f"{row['subcategory']} in {CITY}")

output = pd.DataFrame({
    "query": queries
})

output.to_csv(
    "data/search_queries.csv",
    index=False
)

print(f"Generated {len(output)} search queries.")