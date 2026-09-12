"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  variants: Variant[];
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductPurchaseForm({
  productId,
  slug,
  name,
  price,
  image,
  variants,
}: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );
  const [color, setColor] = useState(colors[0] ?? "");

  const sizesForColor = useMemo(
    () =>
      variants
        .filter((v) => v.color === color)
        .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)),
    [variants, color]
  );

  const [size, setSize] = useState(sizesForColor[0]?.size ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find(
    (v) => v.color === color && v.size === size
  );
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;

  function buildItem() {
    if (!selectedVariant) return null;
    return {
      productId,
      variantId: selectedVariant.id,
      slug,
      name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unitPrice: price,
      image,
      quantity,
    };
  }

  function handleAddToCart() {
    const item = buildItem();
    if (!item) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    const item = buildItem();
    if (!item) return;
    addItem(item);
    router.push("/carrito");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-fg-muted)]">
          Color
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setColor(c);
                const first = variants.find((v) => v.color === c);
                setSize(first?.size ?? "");
              }}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                c === color
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-white/20 text-[var(--color-fg-muted)] hover:border-white/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-fg-muted)]">
          Talle
        </p>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={v.stock <= 0}
              onClick={() => setSize(v.size)}
              className={`h-10 w-14 rounded-md border text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                v.size === size
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-black"
                  : "border-white/20 text-[var(--color-fg)] hover:border-white/40"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-fg-muted)]">
          Cantidad
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 rounded-md border border-white/20 font-bold hover:border-white/40"
          >
            −
          </button>
          <span className="w-8 text-center font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 rounded-md border border-white/20 font-bold hover:border-white/40"
          >
            +
          </button>
        </div>
      </div>

      {outOfStock && (
        <p className="text-sm font-semibold text-red-400">
          Sin stock para esta combinación de talle/color.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="flex-1 rounded-md border border-[var(--color-accent)] px-6 py-3 font-bold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {added ? "¡Agregado!" : "Agregar al carrito"}
        </button>
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleBuyNow}
          className="flex-1 rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
