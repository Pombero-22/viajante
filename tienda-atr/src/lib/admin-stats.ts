import { prisma } from "@/lib/prisma";

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export async function getMonthlySummary() {
  const from = startOfMonth();
  const to = endOfMonth();

  const [visitCount, approvedOrders] = await Promise.all([
    prisma.visit.count({ where: { createdAt: { gte: from, lte: to } } }),
    prisma.order.findMany({
      where: { status: "APPROVED", createdAt: { gte: from, lte: to } },
      select: { totalAmount: true },
    }),
  ]);

  const salesCount = approvedOrders.length;
  const revenue = approvedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const conversionRate = visitCount > 0 ? (salesCount / visitCount) * 100 : 0;

  return { visitCount, salesCount, revenue, conversionRate, from, to };
}

export async function getVisitsInRange(from: Date, to: Date) {
  const visits = await prisma.visit.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();
  const bySource = new Map<string, number>();

  for (const v of visits) {
    const day = v.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
    byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1);
    const source = v.source ?? "directo";
    bySource.set(source, (bySource.get(source) ?? 0) + 1);
  }

  const dailySeries = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const topPages = Array.from(byPath.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const topSources = Array.from(bySource.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({ source, count }));

  return { total: visits.length, dailySeries, topPages, topSources, visits };
}

export async function getOrdersInRange(from: Date, to: Date) {
  return prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: {
      items: { include: { product: true, variant: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
