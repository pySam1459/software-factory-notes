from typing import NewType

from pydantic import BaseModel, ConfigDict

__PASCAL__Id = NewType("__PASCAL__Id", str)


class __PASCAL__(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: __PASCAL__Id
    title: str


def parse___NAME___id(raw: str) -> __PASCAL__Id:
    if raw == "":
        raise ValueError("__NAME__ id must not be empty")
    return __PASCAL__Id(raw)
