from app.models.__NAME__ import __PASCAL__, __PASCAL__Id
from app.repositories.__NAME__ import InMemory__PASCAL__Repository, __PASCAL__Repository, seed___NAME__


class __PASCAL__NotFoundError(Exception):
    def __init__(self, item_id: __PASCAL__Id) -> None:
        super().__init__(f"__PASCAL__ {item_id} was not found")
        self.item_id = item_id


class __PASCAL__Service:
    def __init__(self, items: __PASCAL__Repository) -> None:
        self._items = items

    async def get___NAME__(self, item_id: __PASCAL__Id) -> __PASCAL__:
        item = await self._items.get(item_id)
        if item is None:
            raise __PASCAL__NotFoundError(item_id)
        return item


def default___NAME___service() -> __PASCAL__Service:
    return __PASCAL__Service(InMemory__PASCAL__Repository(seed___NAME__()))
