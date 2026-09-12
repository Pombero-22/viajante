export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-white/10 bg-[var(--color-bg-alt)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-black">
            ATR <span className="text-[var(--color-accent)]">CICLISMO</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-fg-muted)]">
            Ropa y accesorios para ciclismo urbano y de ruta. Diseño, comodidad
            y actitud sobre dos ruedas.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-fg)]">
            Contacto
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li>hola@atrciclismo.com</li>
            <li>WhatsApp: +54 9 11 0000-0000</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-fg)]">
            Seguinos
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://instagram.com/atrciclismo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Instagram @atrciclismo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[var(--color-fg-muted)] sm:px-6">
        © {new Date().getFullYear()} ATR Ciclismo. Todos los derechos reservados.
      </div>
    </footer>
  );
}
