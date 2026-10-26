from fastapi import APIRouter, HTTPException

from app.models.notes import Note, parse_note_id
from app.services.notes import NoteNotFoundError, default_note_service

router = APIRouter()


@router.get("/notes/{note_id}")
async def get_note(note_id: str) -> Note:
    try:
        parsed = parse_note_id(note_id)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    try:
        return await default_note_service().get_note(parsed)
    except NoteNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
