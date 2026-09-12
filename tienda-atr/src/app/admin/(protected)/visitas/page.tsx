import { Suspense } from "react";
import { getVisitsInRange, startOfMonth, endOfMonth } from "@/lib/admin-stats";
import DateRangeFilter from "@/components/admin/DateRangeFilter";

function parseDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

async function VisitasContent({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const defaultFrom = startOfMonth();
  const defaultTo = endOfMonth();

  const from = parseDate(searchParams.from, defaultFrom);
  const to = parseDate(searchParams.to, defaultTo);
  to.setHours(23, 59, 59, 999);

  const { total, dailySeries, topPages, topSources } = await getVisitsInRange(
    from,
    to
  );

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl font-black">Visitas</h1>

      <DateRangeFilter
        defaultFrom={defaultFrom.toISOString().slice(0, 10)}
        defaultTo={defaultTo.toISOString().slice(0, 10)}
      />

      <p className="mb-8 text-lg font-bold">
        Total en el período:{" "}
        <span className="text-[var(--color-accent)]">{total}</span>
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[var(--color-bg-alt)] p-6">
          <h2 className="mb-4 font-bold">Visitas por día</h2>
          {dailySeries.length === 0 && (
            <p className="text-sm text-[var(--color-fg-muted)]">Sin datos.</p>
          )}
          <ul className="space-y-1 text-sm">
            {dailySeries.map((d) => (
              <li key={d.date} className="flex justify-between">
                <span className="text-[var(--color-fg-muted)]">{d.date}</span>
                <span className="font-bold">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-[var(--color-bg-alt)] p-6">
          <h2 className="mb-4 font-bold">Páginas más visitadas</h2>
          {topPages.length === 0 && (
            <p className="text-sm text-[var(--color-fg-muted)]">Sin datos.</p>
          )}
          <ul className="space-y-1 text-sm">
            {topPages.map((p) => (
              <li key={p.path} className="flex justify-between gap-4">
                <span className="truncate text-[var(--color-fg-muted)]">
                  {p.path}
                </span>
                <span className="font-bold">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-[var(--color-bg-alt)] p-6 md:col-span-2">
          <h2 className="mb-4 font-bold">Origen del tráfico</h2>
          {topSources.length === 0 && (
            <p className="text-sm text-[var(--color-fg-muted)]">Sin datos.</p>
          )}
          <ul className="space-y-1 text-sm">
            {topSources.map((s) => (
              <li key={s.source} className="flex justify-between">
                <span className="text-[var(--color-fg-muted)]">{s.source}</span>
                <span className="font-bold">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default async function VisitasPage({
  searchParams,
}: PageProps<"/admin/visitas">) {
  const resolved = await searchParams;
  return (
    <Suspense fallback={null}>
      <VisitasContent searchParams={resolved} />
    </Suspense>
  );
}
