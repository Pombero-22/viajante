import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPreferenceClient } from "@/lib/mercadopago";

const bodySchema = z.object({
  buyer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    address: z.string().min(5),
  }),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { buyer, items } = parsed.data;

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: items.map((i) => i.variantId) } },
    include: { product: true },
  });

  if (variants.length !== items.length) {
    return NextResponse.json(
      { error: "Alguno de los productos ya no está disponible" },
      { status: 400 }
    );
  }

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return NextResponse.json(
        { error: `Sin stock suficiente para ${variant?.product.name ?? "un producto"}` },
        { status: 400 }
      );
    }
  }

  const totalAmount = items.reduce((sum, item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    return sum + variant.product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      shippingAddress: buyer.address,
      totalAmount,
      items: {
        create: items.map((item) => {
          const variant = variants.find((v) => v.id === item.variantId)!;
          return {
            productId: variant.productId,
            variantId: variant.id,
            quantity: item.quantity,
            unitPrice: variant.product.price,
          };
        }),
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const isHttps = siteUrl.startsWith("https://");

  try {
    const preference = await getPreferenceClient().create({
      body: {
        items: items.map((item) => {
          const variant = variants.find((v) => v.id === item.variantId)!;
          return {
            id: variant.id,
            title: `${variant.product.name} - Talle ${variant.size} - ${variant.color}`,
            quantity: item.quantity,
            unit_price: variant.product.price / 100,
            currency_id: "ARS",
          };
        }),
        payer: {
          name: buyer.name,
          email: buyer.email,
          phone: { number: buyer.phone },
        },
        external_reference: order.id,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${siteUrl}/checkout/success?orderId=${order.id}`,
          pending: `${siteUrl}/checkout/pending?orderId=${order.id}`,
          failure: `${siteUrl}/checkout/failure?orderId=${order.id}`,
        },
        ...(isHttps ? { auto_return: "approved" as const } : {}),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({
      initPoint: preference.init_point,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creando preferencia de Mercado Pago", error);
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intentá de nuevo." },
      { status: 502 }
    );
  }
}
