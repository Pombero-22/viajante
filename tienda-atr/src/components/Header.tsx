import Link from "next/link";
import CartBadge from "./CartBadge";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-black tracking-tight">
          ATR <span className="text-[var(--color-accent)]">CICLISMO</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-wide md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/carrito"
          className="text-sm font-bold uppercase tracking-wide text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]"
        >
          <CartBadge />
        </Link>
      </div>
    </header>
  );
}
