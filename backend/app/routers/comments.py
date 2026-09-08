"""تعليقات/تفسيرات المستخدمين الخاصة لكل شخصية — تخزين بسيط بملف JSON، كافي لمشروع بورتفوليو."""

import json
import pathlib
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/characters", tags=["comments"])

DATA_PATH = pathlib.Path(__file__).parent.parent / "data" / "comments.json"
CHARACTERS_PATH = pathlib.Path(__file__).parent.parent / "data" / "characters.json"

_valid_ids = {c["id"] for c in json.loads(CHARACTERS_PATH.read_text(encoding="utf-8"))}

MAX_COMMENT_LENGTH = 600


class CommentInput(BaseModel):
    author: str = Field(default="زائر", max_length=40)
    text: str = Field(min_length=3, max_length=MAX_COMMENT_LENGTH)


def _load() -> dict:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def _save(data: dict) -> None:
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


@router.get("/{character_id}/comments")
def list_comments(character_id: str):
    if character_id not in _valid_ids:
        raise HTTPException(status_code=404, detail="Character not found")
    return _load().get(character_id, [])


@router.post("/{character_id}/comments")
def add_comment(character_id: str, comment: CommentInput):
    if character_id not in _valid_ids:
        raise HTTPException(status_code=404, detail="Character not found")

    data = _load()
    entry = {
        "id": str(uuid.uuid4()),
        "author": comment.author.strip() or "زائر",
        "text": comment.text.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    data.setdefault(character_id, []).insert(0, entry)
    _save(data)
    return entry
