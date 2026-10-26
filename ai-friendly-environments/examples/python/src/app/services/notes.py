from app.models.notes import Note, NoteId
from app.repositories.notes import InMemoryNoteRepository, NoteRepository, seed_notes


class NoteNotFoundError(Exception):
    def __init__(self, note_id: NoteId) -> None:
        super().__init__(f"Note {note_id} was not found")
        self.note_id = note_id


class NoteService:
    def __init__(self, notes: NoteRepository) -> None:
        self._notes = notes

    async def get_note(self, note_id: NoteId) -> Note:
        note = await self._notes.get(note_id)
        if note is None:
            raise NoteNotFoundError(note_id)
        return note


def default_note_service() -> NoteService:
    return NoteService(InMemoryNoteRepository(seed_notes()))
