---
name: colocate-small-domain-errors
subject: Small domain-specific exception types in the Python backend.
requirement: Define small domain-specific exception types in the module of the operation that raises them rather than in a shared errors module, unless separate ownership or dependency constraints justify a separate module.
purpose: Keep small error definitions close to their meaning and avoid unnecessary module fragmentation.
---

Adapted from the example on https://traits.sh/.

```diff
-# errors.py
-class InvalidDocument(Exception): ...
-
-# parse.py
-from app.errors import InvalidDocument
+# parse.py
+class InvalidDocument(Exception):
+    def __init__(self, path: str) -> None:
+        super().__init__(f"Invalid document at {path}")
+        self.path = path
```
