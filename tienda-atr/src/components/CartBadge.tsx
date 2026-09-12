"use client";

import { useCartStore, useCartHydrated } from "@/lib/cart-store";

export default function CartBadge() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartHydrated();

  const count = hydrated ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <span className="relative">
      Carrito
      {count > 0 && (
        <span className="absolute -top-2 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-black">
          {count}
        </span>
      )}
    </span>
  );
}
