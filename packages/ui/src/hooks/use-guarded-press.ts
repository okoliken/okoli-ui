import { useCallback, useRef } from "react";

/**
 * Wraps a handler so a double tap only fires it once: calls within `lockMs` of the last accepted
 * one are dropped. Use it for anything that navigates or submits.
 */
export function useGuardedPress<Args extends unknown[]>(handler: ((...args: Args) => void) | undefined, lockMs = 500) {
  const last = useRef(0);
  return useCallback(
    (...args: Args) => {
      const now = Date.now();
      if (now - last.current < lockMs) return;
      last.current = now;
      handler?.(...args);
    },
    [handler, lockMs],
  );
}
