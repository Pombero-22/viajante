"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useCartHydrated, cartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hydrated = useCartHydrated();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/carrito");
    }
  }, [hydrated, items.length, router]);

  if (!hydrated || items.length === 0) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: form,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar el pago.");
        setLoading(false);
        return;
      }

      window.location.href = data.initPoint;
    } catch {
      setError("Ocurrió un error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-heading mb-8 text-3xl font-black">Checkout</h1>

      <div className="mb-8 rounded-lg border border-white/10 bg-[var(--color-bg-alt)] p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold">Total ({items.length} producto{items.length > 1 ? "s" : ""})</span>
          <span className="text-xl font-black text-[var(--color-accent)]">
            {formatPrice(cartTotal(items))}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Nombre y apellido</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Teléfono</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Dirección de envío
          </label>
          <textarea
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-[var(--color-accent)]"
            rows={3}
          />
        </div>

        {error && <p className="text-sm font-semibold text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
        </button>
      </form>
    </section>
  );
}
