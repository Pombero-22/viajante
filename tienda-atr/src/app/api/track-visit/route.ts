import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function deriveSource(referrer: string | null, utmSource: string | null) {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "directo";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook") || host.includes("fb.com")) return "facebook";
    if (host.includes("google")) return "google";
    if (host.includes("whatsapp")) return "whatsapp";
    if (host.includes("tiktok")) return "tiktok";
    return host;
  } catch {
    return "directo";
  }
}

export async function POST(request: Request) {
  let body: { path?: string; referrer?: string | null; utmSource?: string | null };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = body.path;
  if (!path || typeof path !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const productMatch = path.match(/^\/productos\/([^/]+)\/?$/);
  let productId: string | undefined;

  if (productMatch) {
    const product = await prisma.product.findUnique({
      where: { slug: productMatch[1] },
      select: { id: true },
    });
    productId = product?.id;
  }

  await prisma.visit.create({
    data: {
      path,
      referrer: body.referrer ?? null,
      source: deriveSource(body.referrer ?? null, body.utmSource ?? null),
      productId,
    },
  });

  return NextResponse.json({ ok: true });
}
