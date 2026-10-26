import subprocess
import sys
from pathlib import Path


def _script() -> Path:
    return Path(__file__).resolve().parents[1] / "scripts" / "new_endpoint.py"


def test_generator_writes_one_endpoint(tmp_path: Path) -> None:
    completed = subprocess.run(
        [sys.executable, str(_script()), "--root", str(tmp_path), "name=widget"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert completed.returncode == 0, completed.stderr
    api = (tmp_path / "src" / "app" / "api" / "widget.py").read_text(encoding="utf-8")
    assert "APIRouter" in api
    assert "/widget/{item_id}" in api
    assert (tmp_path / "src" / "app" / "services" / "widget.py").is_file()
    assert (tmp_path / "src" / "app" / "repositories" / "widget.py").is_file()
    assert (tmp_path / "src" / "app" / "models" / "widget.py").is_file()
    assert (tmp_path / "tests" / "test_widget.py").is_file()
    client = (tmp_path / "frontend" / "widgetClient.ts").read_text(encoding="utf-8")
    assert "export async function getWidget" in client
    assert "create_app loads app.api modules that export router." in completed.stdout


def test_generator_rejects_a_second_path(tmp_path: Path) -> None:
    bad = subprocess.run(
        [sys.executable, str(_script()), "--root", str(tmp_path), "Widget"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert bad.returncode == 1
    assert "snake_case" in bad.stderr
    subprocess.run(
        [sys.executable, str(_script()), "--root", str(tmp_path), "widget"],
        check=True,
        capture_output=True,
        text=True,
    )
    again = subprocess.run(
        [sys.executable, str(_script()), "--root", str(tmp_path), "widget"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert again.returncode == 1
    assert "Refusing to overwrite" in again.stderr
