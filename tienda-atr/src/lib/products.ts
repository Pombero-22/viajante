import { prisma } from "@/lib/prisma";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function sortSizes(sizes: string[]) {
  return [...sizes].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "asc" },
  });

  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    images: p.images,
    sizes: sortSizes(
      Array.from(new Set(p.variants.filter((v) => v.stock > 0).map((v) => v.size)))
    ),
  }));
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { variants: true },
  });
}
