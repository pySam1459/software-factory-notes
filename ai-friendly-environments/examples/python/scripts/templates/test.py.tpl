import httpx

from app.models.__NAME__ import __PASCAL__, __PASCAL__Id


async def test_get___NAME___returns_the_seed(client: httpx.AsyncClient) -> None:
    response = await client.get("/__KEBAB__/__NAME__-1")
    assert response.status_code == 200
    assert __PASCAL__.model_validate_json(response.text) == __PASCAL__(
        id=__PASCAL__Id("__NAME__-1"),
        title="Example",
    )


async def test_missing___NAME___returns_404(client: httpx.AsyncClient) -> None:
    response = await client.get("/__KEBAB__/missing")
    assert response.status_code == 404
