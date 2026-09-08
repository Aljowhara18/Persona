import json
import pathlib
from typing import Optional

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/characters", tags=["characters"])

DATA_PATH = pathlib.Path(__file__).parent.parent / "data" / "characters.json"
_characters = json.loads(DATA_PATH.read_text(encoding="utf-8"))


@router.get("")
def list_characters(type: Optional[str] = None):
    if type:
        return [c for c in _characters if c["type"] == type]
    return _characters


@router.get("/{character_id}")
def get_character(character_id: str):
    for char in _characters:
        if char["id"] == character_id:
            return char
    raise HTTPException(status_code=404, detail="Character not found")
