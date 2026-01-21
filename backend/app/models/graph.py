from pydantic import BaseModel


class PostNode(BaseModel):
    likeCount: int
    children: list["PostNode"] = []

    @staticmethod
    def from_data(data: dict) -> dict:
        return {
            "likeCount": data["post"]["likeCount"],
            "children": [
                PostNode.from_data(reply) for reply in data.get("replies", [])
            ],
        }
