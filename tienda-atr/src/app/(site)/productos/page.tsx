import ProductCard from "@/components/ProductCard";
import { getActiveProducts } from "@/lib/products";

export const metadata = {
  title: "Productos | ATR Ciclismo",
};

export const revalidate = 60;

export default async function ProductosPage() {
  const products = await getActiveProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading mb-8 text-3xl font-black">Productos</h1>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
