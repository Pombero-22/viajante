"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  unitPrice: number; // centavos
  image: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      setQuantity: (variantId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "atr-cart" }
  )
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

// El carrito se persiste en localStorage, así que en el primer render del
// servidor siempre está vacío. Este hook evita mismatches de hidratación
// esperando a que zustand termine de leer localStorage antes de confiar
// en los datos del store.
export function useCartHydrated() {
  return useSyncExternalStore(
    (callback) => useCartStore.persist.onFinishHydration(callback),
    () => useCartStore.persist.hasHydrated(),
    () => false
  );
}
