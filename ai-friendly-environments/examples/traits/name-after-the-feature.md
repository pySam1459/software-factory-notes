---
name: name-after-the-feature
subject: Names of new modules, components, routes, functions and types in both the Python backend and the TypeScript frontend.
requirement: Name things after the product feature or domain concept they serve, using the same term in backend and frontend, rather than after their implementation or a generic role (Manager, Helper, Utils, Data), unless the code is genuinely generic infrastructure with no feature owner.
purpose: Let a reader (or an agent searching the repo) find all the code for a feature by its name, and stop generic modules becoming dumping grounds.
---

```diff
-frontend/src/utils/dataHelpers.ts      formatShareRow()
-backend/app/managers/link_manager.py   LinkManager
+frontend/src/sharing/shareList.ts      formatShareRow()
+backend/app/sharing/share_links.py     create_share_link()
```
