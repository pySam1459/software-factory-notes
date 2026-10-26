from collections.abc import Mapping
from typing import Protocol

from app.models.__NAME__ import __PASCAL__, __PASCAL__Id


class __PASCAL__Repository(Protocol):
    async def get(self, item_id: __PASCAL__Id) -> __PASCAL__ | None: ...


class InMemory__PASCAL__Repository:
    def __init__(self, items: Mapping[__PASCAL__Id, __PASCAL__]) -> None:
        self._items = dict(items)

    async def get(self, item_id: __PASCAL__Id) -> __PASCAL__ | None:
        return self._items.get(item_id)


def seed___NAME__() -> dict[__PASCAL__Id, __PASCAL__]:
    item_id = __PASCAL__Id("__NAME__-1")
    return {item_id: __PASCAL__(id=item_id, title="Example")}
