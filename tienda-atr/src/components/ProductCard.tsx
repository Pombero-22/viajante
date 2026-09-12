import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-[var(--color-bg-alt)] transition-transform hover:-translate-y-1"
    >
      <div className="aspect-[3/3.5] overflow-hidden bg-black/30">
        <img
          src={product.images[0] ?? "/products/remera-negra-01.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold">{product.name}</h3>
        <p className="mt-1 text-xl font-black text-[var(--color-accent)]">
          {formatPrice(product.price)}
        </p>
        {product.sizes.length > 0 && (
          <p className="mt-2 text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">
            Talles: {product.sizes.join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
