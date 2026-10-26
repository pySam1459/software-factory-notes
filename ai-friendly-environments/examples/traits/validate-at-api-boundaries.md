---
name: validate-at-api-boundaries
subject: Data entering or leaving the Python backend (HTTP request and response bodies, queue messages, third-party API responses).
requirement: Parse boundary data into Pydantic models at the edge and pass those typed models inward; internal functions accept models or plain typed values, never raw dicts or Any, unless the data is genuinely schemaless and documented as such in the model name.
purpose: Keep validation in one place so internal code can trust its inputs, and keep the frontend's generated types in sync with a single schema.
---

```diff
-@router.post("/projects")
-async def create_project(payload: dict) -> dict:
-    name = payload.get("name", "")
-    return service.create(name, payload.get("owner"))
+class CreateProject(BaseModel):
+    name: str = Field(min_length=1)
+    owner_id: UUID
+
+@router.post("/projects")
+async def create_project(body: CreateProject) -> ProjectOut:
+    return service.create(body)
```
