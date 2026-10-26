import importlib
import pkgutil

from fastapi import APIRouter, FastAPI

from app import api
from app.log import get_logger


def create_app() -> FastAPI:
    get_logger("app").info("ready")
    application = FastAPI()
    for module_info in pkgutil.iter_modules(api.__path__):
        if module_info.name.startswith("_"):
            continue
        module = importlib.import_module(f"app.api.{module_info.name}")
        router = vars(module).get("router")
        if isinstance(router, APIRouter):
            application.include_router(router)
    return application
