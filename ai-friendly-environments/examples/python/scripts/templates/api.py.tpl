from fastapi import APIRouter, HTTPException

from app.models.__NAME__ import __PASCAL__, parse___NAME___id
from app.services.__NAME__ import __PASCAL__NotFoundError, default___NAME___service

router = APIRouter()


@router.get("/__KEBAB__/{item_id}")
async def get___NAME__(item_id: str) -> __PASCAL__:
    try:
        parsed = parse___NAME___id(item_id)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    try:
        return await default___NAME___service().get___NAME__(parsed)
    except __PASCAL__NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
