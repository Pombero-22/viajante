import Link from "next/link";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export default function CheckoutPendingPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/15 text-3xl text-yellow-400">
        ⏳
      </div>
      <h1 className="font-heading text-3xl font-black">Pago pendiente</h1>
      <p className="mt-4 text-[var(--color-fg-muted)]">
        Tu pago está siendo procesado. Te vamos a avisar por email apenas se
        confirme (esto puede tardar hasta unas horas dependiendo del medio de
        pago elegido).
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
