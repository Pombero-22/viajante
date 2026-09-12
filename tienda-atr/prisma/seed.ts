import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIZES = ["S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  {
    slug: "remera-tech-negra",
    name: "Remera Tech Negra",
    description:
      "Remera técnica de secado rápido, ideal para rodar en cualquier estación. Tela liviana y transpirable con logo ATR en el pecho.",
    price: 2500000, // $25.000
    images: ["/products/remera-negra-01.svg"],
    color: "Negro",
  },
  {
    slug: "remera-urban-verde",
    name: "Remera Urban Verde",
    description:
      "Remera de algodón peinado con estampa urbana inspirada en la cultura ciclista. Corte relajado, verde lima ATR.",
    price: 2200000,
    images: ["/products/remera-verde-01.svg"],
    color: "Verde lima",
  },
  {
    slug: "remera-classic-gris",
    name: "Remera Classic Gris",
    description:
      "Nuestro clásico de siempre: remera gris melange con logo bordado. Comodidad total dentro y fuera de la bici.",
    price: 2000000,
    images: ["/products/remera-gris-01.svg"],
    color: "Gris",
  },
  {
    slug: "remera-race-negra",
    name: "Remera Race Negra",
    description:
      "Edición race fit, más ajustada para entrenamientos. Tela con protección UV y costuras reforzadas.",
    price: 2700000,
    images: ["/products/remera-negra-02.svg"],
    color: "Negro",
  },
];

async function main() {
  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
      },
    });

    for (const size of SIZES) {
      await prisma.productVariant.upsert({
        where: {
          productId_size_color: {
            productId: product.id,
            size,
            color: p.color,
          },
        },
        update: { stock: 15 },
        create: {
          productId: product.id,
          size,
          color: p.color,
          stock: 15,
        },
      });
    }
  }

  console.log(`Seed completo: ${PRODUCTS.length} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
