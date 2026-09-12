import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "SHIPPED", "DELIVERED"];

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/admin/orders/[id]">
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { shippingStatus } = await request.json();

  if (!VALID_STATUSES.includes(shippingStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { shippingStatus },
  });

  return NextResponse.json({ ok: true, order });
}
