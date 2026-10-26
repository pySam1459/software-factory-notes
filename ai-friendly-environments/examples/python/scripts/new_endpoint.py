import keyword
import re
import shutil
import subprocess
import sys
from pathlib import Path

_NAME = re.compile(r"^[a-z][a-z0-9_]*$")
_USAGE = (
    "Usage: just new-endpoint name=<snake_case>. Example: just new-endpoint name=widget"
)


def pascal(name: str) -> str:
    return "".join(part.capitalize() for part in name.split("_") if part)


def kebab(name: str) -> str:
    return name.replace("_", "-")


def endpoint_name(raw: str) -> str:
    if raw.startswith("name="):
        return raw.removeprefix("name=")
    return raw


def parse_args(argv: list[str]) -> tuple[str, Path]:
    args = argv[1:]
    root = Path(__file__).resolve().parents[1]
    if args and args[0] == "--root":
        if len(args) != 3:
            raise SystemExit(_USAGE)
        return endpoint_name(args[2]), Path(args[1])
    if len(args) != 1:
        raise SystemExit(_USAGE)
    return endpoint_name(args[0]), root


def destinations(root: Path, name: str) -> dict[str, Path]:
    return {
        "model.py.tpl": root / "src" / "app" / "models" / f"{name}.py",
        "repository.py.tpl": root / "src" / "app" / "repositories" / f"{name}.py",
        "service.py.tpl": root / "src" / "app" / "services" / f"{name}.py",
        "api.py.tpl": root / "src" / "app" / "api" / f"{name}.py",
        "test.py.tpl": root / "tests" / f"test_{name}.py",
        "client.ts.tpl": root / "frontend" / f"{name}Client.ts",
    }


def render(template: str, name: str) -> str:
    replacements = {
        "__PASCAL__": pascal(name),
        "__KEBAB__": kebab(name),
        "__NAME__": name,
    }
    text = template
    for key, value in replacements.items():
        text = text.replace(key, value)
    return text


def format_python(paths: list[Path]) -> None:
    ruff = shutil.which("ruff")
    if ruff is None:
        return
    subprocess.run([ruff, "format", *[str(path) for path in paths]], check=True)


def _valid_name(name: str) -> bool:
    if _NAME.fullmatch(name) is None or "__" in name or name.endswith("_"):
        return False
    return not keyword.iskeyword(name)


def main(argv: list[str]) -> None:
    name, root = parse_args(argv)
    if not _valid_name(name):
        raise SystemExit(f"Endpoint name must be snake_case. {_USAGE}")
    outputs = destinations(root, name)
    existing = [path for path in outputs.values() if path.exists()]
    if existing:
        joined = ", ".join(str(path) for path in existing)
        message = (
            f"Refusing to overwrite {joined}. Pick a new name or delete those files."
        )
        raise SystemExit(message)
    template_dir = Path(__file__).resolve().parent / "templates"
    written: list[Path] = []
    for template_name, destination in outputs.items():
        text = render((template_dir / template_name).read_text(encoding="utf-8"), name)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text, encoding="utf-8")
        written.append(destination)
        print(destination)
    format_python([path for path in written if path.suffix == ".py"])
    print("create_app loads app.api modules that export router.")
    print("Do not register the router by hand.")


if __name__ == "__main__":
    main(sys.argv)
