from fastapi import APIRouter, HTTPException, UploadFile

from app.services.personality_model import predict
from app.services.script_parser import parse_script

router = APIRouter(prefix="/scripts", tags=["scripts"])

MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024  # 2MB


@router.post("/upload")
async def upload_script(file: UploadFile):
    raw_bytes = await file.read()
    if len(raw_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="الملف كبير جداً (الحد الأقصى 2MB)")

    text = raw_bytes.decode("utf-8", errors="ignore")
    lines_by_character = parse_script(text)

    if not lines_by_character:
        raise HTTPException(
            status_code=422,
            detail="ما قدرنا نستخرج شخصيات. تأكدي إن الملف بصيغة 'NAME: dialogue' بكل سطر.",
        )

    characters = []
    for name, lines in lines_by_character.items():
        full_text = " ".join(lines)
        scores = predict(full_text)
        characters.append(
            {
                "id": name.lower().replace(" ", "-"),
                "name_ar": name,
                "name_en": name,
                "work": file.filename,
                "type": "uploaded",
                "scores": scores,
                "quotes": lines[:4],
            }
        )

    return {"characters": characters}
