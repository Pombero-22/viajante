import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/hero.svg"
          alt="ATR Ciclismo"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 md:py-36">
          <p className="rounded-full bg-[var(--color-accent)]/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Nueva colección
          </p>
          <h1 className="font-heading max-w-xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Remeras para{" "}
            <span className="text-[var(--color-accent)]">rodar</span>
          </h1>
          <p className="max-w-md text-[var(--color-fg-muted)]">
            Ropa técnica y urbana para ciclismo. Diseñada para pedalear la
            ciudad y la ruta con estilo.
          </p>
          <Link
            href="/productos"
            className="rounded-md bg-[var(--color-accent)] px-6 py-3 font-bold text-black transition-transform hover:scale-105"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading mb-8 text-2xl font-bold sm:text-3xl">
          Nuestras remeras
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-[var(--color-fg-muted)]">
            Todavía no hay productos cargados.
          </p>
        )}
      </section>

      <section
        id="nosotros"
        className="border-t border-white/10 bg-[var(--color-bg-alt)]"
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Sobre la marca
          </h2>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            ATR Ciclismo nació de la pasión por rodar en la ciudad. Diseñamos
            remeras y accesorios pensados para ciclistas urbanos: cómodas,
            resistentes y con una estética que combina lo deportivo con lo
            urbano. Cada prenda está pensada para acompañarte arriba y abajo
            de la bici.
          </p>
        </div>
      </section>
    </>
  );
}
