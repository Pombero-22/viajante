import { Suspense } from "react";
import { getOrdersInRange, startOfMonth, endOfMonth } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/format";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import ShippingStatusSelect from "@/components/admin/ShippingStatusSelect";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400",
  APPROVED: "text-[var(--color-accent)]",
  REJECTED: "text-red-400",
  CANCELLED: "text-[var(--color-fg-muted)]",
};

function parseDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

async function VentasContent({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const defaultFrom = startOfMonth();
  const defaultTo = endOfMonth();

  const from = parseDate(searchParams.from, defaultFrom);
  const to = parseDate(searchParams.to, defaultTo);
  to.setHours(23, 59, 59, 999);

  const orders = await getOrdersInRange(from, to);
  const approvedOrders = orders.filter((o) => o.status === "APPROVED");
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl font-black">Ventas cerradas</h1>

      <DateRangeFilter
        defaultFrom={defaultFrom.toISOString().slice(0, 10)}
        defaultTo={defaultTo.toISOString().slice(0, 10)}
      />

      <p className="mb-6 text-lg font-bold">
        {approvedOrders.length} venta{approvedOrders.length !== 1 ? "s" : ""}{" "}
        aprobada{approvedOrders.length !== 1 ? "s" : ""} ·{" "}
        <span className="text-[var(--color-accent)]">
          {formatPrice(totalRevenue)}
        </span>
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Comprador</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Envío</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 text-[var(--color-fg-muted)]">
                  {order.createdAt.toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{order.buyerName}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    {order.buyerEmail}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-fg-muted)]">
                  {order.items
                    .map(
                      (i) =>
                        `${i.product.name} (${i.variant.size}/${i.variant.color}) x${i.quantity}`
                    )
                    .join(", ")}
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ShippingStatusSelect
                    orderId={order.id}
                    value={order.shippingStatus}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--color-fg-muted)]"
                >
                  No hay órdenes en este período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function VentasPage({
  searchParams,
}: PageProps<"/admin/ventas">) {
  const resolved = await searchParams;
  return (
    <Suspense fallback={null}>
      <VentasContent searchParams={resolved} />
    </Suspense>
  );
}
