import httpx
import pytest

from app.models.notes import Note, NoteId, parse_note_id


async def test_get_note_returns_the_seed_note(client: httpx.AsyncClient) -> None:
    response = await client.get("/notes/n1")
    assert response.status_code == 200
    assert Note.model_validate_json(response.text) == Note(
        id=NoteId("n1"),
        title="Release planning",
    )


async def test_missing_note_returns_404(client: httpx.AsyncClient) -> None:
    response = await client.get("/notes/missing")
    assert response.status_code == 404


def test_parse_note_id_rejects_blank() -> None:
    with pytest.raises(ValueError, match="must not be empty"):
        parse_note_id("")
