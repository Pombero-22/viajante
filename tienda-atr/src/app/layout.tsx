import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATR Ciclismo | Remeras para ciclismo urbano",
  description:
    "Remeras y ropa para ciclismo inspiradas en la cultura urbana. Comprá online con envíos a todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-fg)]">
        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
