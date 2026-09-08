import json
import pathlib

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/quiz", tags=["quiz"])

DATA_DIR = pathlib.Path(__file__).parent.parent / "data"
_questions = json.loads((DATA_DIR / "quiz_questions.json").read_text(encoding="utf-8"))
_characters = json.loads((DATA_DIR / "characters.json").read_text(encoding="utf-8"))


class Answer(BaseModel):
    question_id: int
    value: int  # 1-5


class QuizSubmission(BaseModel):
    answers: list[Answer]


@router.get("/questions")
def get_questions():
    return _questions


def _score_answers(answers: list[Answer]) -> dict[str, float]:
    by_id = {q["id"]: q for q in _questions}
    totals: dict[str, list[float]] = {}

    for answer in answers:
        question = by_id.get(answer.question_id)
        if not question:
            continue
        raw = answer.value
        adjusted = (6 - raw) if question["reverse"] else raw
        totals.setdefault(question["trait"], []).append(adjusted)

    scores = {}
    for trait, values in totals.items():
        avg = sum(values) / len(values)
        scores[trait] = round((avg - 1) / 4, 3)  # normalize 1-5 -> 0-1
    return scores


@router.post("/submit")
def submit_quiz(submission: QuizSubmission):
    from app.services.matcher import find_matches

    user_scores = _score_answers(submission.answers)
    matches = find_matches(user_scores, _characters, top_n=3)
    return {"user_scores": user_scores, "matches": matches}
