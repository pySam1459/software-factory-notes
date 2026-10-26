from typing import NewType

from pydantic import BaseModel, ConfigDict

NoteId = NewType("NoteId", str)


class Note(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: NoteId
    title: str


def parse_note_id(raw: str) -> NoteId:
    if raw == "":
        raise ValueError("note id must not be empty")
    return NoteId(raw)
