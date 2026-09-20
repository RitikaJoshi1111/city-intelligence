import json
import os

PROGRESS_FILE = "state/progress.json"


def load_progress():

    if not os.path.exists(PROGRESS_FILE):
        return []

    with open(PROGRESS_FILE, "r") as f:
        data = json.load(f)

    return data.get("completed_queries", [])


def save_progress(completed):

    with open(PROGRESS_FILE, "w") as f:
        json.dump(
            {
                "completed_queries": completed
            },
            f,
            indent=4
        )