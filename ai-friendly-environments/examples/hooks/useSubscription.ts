import { useSyncExternalStore } from 'react';

export interface ExternalStore<T> {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => T;
}

export function useSubscription<T>(store: ExternalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
