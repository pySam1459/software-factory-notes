from collections.abc import Mapping
from typing import Protocol

from app.models.notes import Note, NoteId


class NoteRepository(Protocol):
    async def get(self, note_id: NoteId) -> Note | None: ...


class InMemoryNoteRepository:
    def __init__(self, notes: Mapping[NoteId, Note]) -> None:
        self._notes = dict(notes)

    async def get(self, note_id: NoteId) -> Note | None:
        return self._notes.get(note_id)


def seed_notes() -> dict[NoteId, Note]:
    note_id = NoteId("n1")
    return {note_id: Note(id=note_id, title="Release planning")}
