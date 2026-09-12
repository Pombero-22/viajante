"use client";

import Link from "next/link";
import { useCartStore, useCartHydrated, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const hydrated = useCartHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold">Tu carrito está vacío</h1>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading mb-8 text-3xl font-black">Carrito</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.variantId}
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-[var(--color-bg-alt)] p-4"
          >
            <img
              src={item.image ?? "/products/remera-negra-01.svg"}
              alt={item.name}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-[var(--color-fg-muted)]">
                Talle {item.size} · {item.color}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                  className="h-7 w-7 rounded border border-white/20 text-sm font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                  className="h-7 w-7 rounded border border-white/20 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[var(--color-accent)]">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.variantId)}
                className="mt-2 text-xs text-[var(--color-fg-muted)] underline hover:text-red-400"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="text-lg font-bold">Subtotal</span>
        <span className="text-2xl font-black text-[var(--color-accent)]">
          {formatPrice(cartTotal(items))}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-md bg-[var(--color-accent)] px-6 py-3 text-center font-bold text-black transition-transform hover:scale-105"
      >
        Continuar al pago
      </Link>
    </section>
  );
}
