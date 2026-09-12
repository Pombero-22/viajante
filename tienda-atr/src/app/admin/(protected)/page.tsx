import { getMonthlySummary } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/format";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-bg-alt)] p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-[var(--color-accent)]">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const summary = await getMonthlySummary();
  const monthLabel = summary.from.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h1 className="font-heading mb-1 text-2xl font-black">Resumen</h1>
      <p className="mb-8 text-sm text-[var(--color-fg-muted)] capitalize">
        {monthLabel}
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Visitas" value={summary.visitCount.toLocaleString("es-AR")} />
        <StatCard label="Ventas" value={summary.salesCount.toLocaleString("es-AR")} />
        <StatCard label="Facturado" value={formatPrice(summary.revenue)} />
        <StatCard
          label="Conversión"
          value={`${summary.conversionRate.toFixed(1)}%`}
        />
      </div>
    </div>
  );
}
