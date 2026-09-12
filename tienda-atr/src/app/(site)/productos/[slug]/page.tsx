import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductPurchaseForm from "@/components/ProductPurchaseForm";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: PageProps<"/productos/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--color-bg-alt)]">
          <img
            src={product.images[0] ?? "/products/remera-negra-01.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-heading text-3xl font-black">{product.name}</h1>
          <p className="mt-2 text-2xl font-black text-[var(--color-accent)]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-[var(--color-fg-muted)]">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductPurchaseForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.images[0] ?? null}
              variants={product.variants}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
