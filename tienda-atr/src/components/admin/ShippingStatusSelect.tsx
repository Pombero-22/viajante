"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

export default function ShippingStatusSelect({
  orderId,
  value,
}: {
  orderId: string;
  value: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingStatus: newStatus }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-white/20 bg-[var(--color-bg)] px-2 py-1 text-sm"
    >
      {Object.entries(LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
