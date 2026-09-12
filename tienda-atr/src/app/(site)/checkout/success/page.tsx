import Link from "next/link";
import ClearCartOnMount from "@/components/ClearCartOnMount";

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-3xl text-[var(--color-accent)]">
        ✓
      </div>
      <h1 className="font-heading text-3xl font-black">¡Pago aprobado!</h1>
      <p className="mt-4 text-[var(--color-fg-muted)]">
        Gracias por tu compra. Te enviamos un email con los detalles del
        pedido. Pronto nos vamos a poner en contacto para coordinar el envío.
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
