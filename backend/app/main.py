from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import characters, comments, quiz, scripts

app = FastAPI(title="Persona Archive API")

app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router)
app.include_router(comments.router)
app.include_router(quiz.router)
app.include_router(scripts.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "persona-archive-api"}
