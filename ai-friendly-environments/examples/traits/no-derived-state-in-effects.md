---
name: no-derived-state-in-effects
subject: React components and hooks that hold state derived from props, other state or query data.
requirement: Compute derived values during render (inline or with useMemo when measurably expensive) instead of storing them in state and syncing them with an effect or an effect wrapper; reset state on identity change with a key, not an effect.
purpose: Avoid extra renders, stale intermediate UI and the sync bugs that come from two sources of truth for the same value.
---

```diff
-const [fullName, setFullName] = useState("");
-useEffect(() => {
-  setFullName(`${user.first} ${user.last}`);
-}, [user.first, user.last]);
+const fullName = `${user.first} ${user.last}`;
```

```diff
-useEffect(() => { setDraft(initialDraft); }, [documentId]);
-return <Editor draft={draft} />;
+return <Editor key={documentId} initialDraft={initialDraft} />;
```
