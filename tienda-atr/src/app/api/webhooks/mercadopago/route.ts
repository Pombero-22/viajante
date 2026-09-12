import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentClient } from "@/lib/mercadopago";

function mapMpStatus(status?: string) {
  switch (status) {
    case "approved":
      return "APPROVED" as const;
    case "rejected":
      return "REJECTED" as const;
    case "cancelled":
      return "CANCELLED" as const;
    default:
      return "PENDING" as const;
  }
}

// Mercado Pago reintenta el webhook si no respondemos 200, así que
// cualquier error interno igual devuelve 200 luego de loguear, salvo
// que el payload sea inválido.
export async function POST(request: Request) {
  let body: { type?: string; topic?: string; data?: { id?: string } };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const url = new URL(request.url);
  const type = body.type ?? body.topic ?? url.searchParams.get("type");
  const paymentId = body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPaymentClient().get({ id: paymentId });
    const orderId = payment.external_reference;

    if (!orderId) {
      console.warn("Webhook de MP sin external_reference", paymentId);
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.warn("Orden no encontrada para el pago de MP", orderId);
      return NextResponse.json({ received: true });
    }

    const newStatus = mapMpStatus(payment.status);

    // Evita descontar stock más de una vez si MP reenvía el webhook.
    if (newStatus === "APPROVED" && order.status !== "APPROVED") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus, mpPaymentId: String(payment.id) },
        }),
        ...order.items.map((item) =>
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: newStatus, mpPaymentId: String(payment.id) },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago", error);
    return NextResponse.json({ received: true });
  }
}
