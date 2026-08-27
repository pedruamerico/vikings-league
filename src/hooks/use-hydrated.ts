"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false durante o SSR e no primeiro render do cliente, true depois de hidratar.
 *
 * Existe porque `useReducedMotion()` devolve null no servidor: sem esta guarda,
 * servidor e cliente escolhem ramos diferentes e a hidratação quebra. É
 * `useSyncExternalStore` em vez de useState+useEffect para não disparar um
 * render em cascata.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
