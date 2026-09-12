import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-3xl text-red-400">
        ✕
      </div>
      <h1 className="font-heading text-3xl font-black">Pago rechazado</h1>
      <p className="mt-4 text-[var(--color-fg-muted)]">
        No pudimos procesar tu pago. Tu carrito sigue guardado, podés
        intentar de nuevo con otro medio de pago.
      </p>
      <Link
        href="/checkout"
        className="mt-8 inline-block rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black"
      >
        Reintentar pago
      </Link>
    </section>
  );
}
