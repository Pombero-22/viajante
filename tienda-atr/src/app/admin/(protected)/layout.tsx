import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/visitas", label: "Visitas" },
  { href: "/admin/ventas", label: "Ventas" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="font-heading text-lg font-black">
            ATR <span className="text-[var(--color-accent)]">CRM</span>
          </p>
          <nav className="flex gap-6 text-sm font-semibold uppercase tracking-wide">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
