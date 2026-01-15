from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_thread(at_id: str, rkey: str):
    """
    Fetches the post thread from Bluesky given an at_id and rkey.

    Args:
        at_id (str): The handle of the post author.
        rkey (str): The record key of the post.
    """
    uri = f"at://{at_id}/app.bsky.feed.post/{rkey}"
    res = requests.get(f"https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri={uri}")

    if res.status_code != 200:
        return {"error": "Failed to fetch post thread."}

    return res.json()
