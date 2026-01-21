import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.graph import PostNode

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_thread(at_id: str, rkey: str) -> PostNode | None:
    """
    Fetches the post thread from Bluesky given an at_id and rkey.

    Args:
        at_id (str): The handle of the post author.
        rkey (str): The record key of the post.

    Returns:
        PostNode | None: The root PostNode of the thread, or None if not found.
    """
    uri = f"at://{at_id}/app.bsky.feed.post/{rkey}"
    res = requests.get(
        f"https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri={uri}"
    )

    if res.status_code != 200:
        return None

    return PostNode(**PostNode.from_data(res.json()["thread"]))
