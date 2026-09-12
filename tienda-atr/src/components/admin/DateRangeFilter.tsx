"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function DateRangeFilter({
  defaultFrom,
  defaultTo,
}: {
  defaultFrom: string;
  defaultTo: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") ?? defaultFrom);
  const [to, setTo] = useState(searchParams.get("to") ?? defaultTo);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(`${pathname}?from=${from}&to=${to}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-3"
    >
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-[var(--color-fg-muted)]">
          Desde
        </label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase text-[var(--color-fg-muted)]">
          Hasta
        </label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-black"
      >
        Filtrar
      </button>
    </form>
  );
}
