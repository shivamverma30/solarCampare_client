import prisma from "../../lib/prisma";

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(text: string, params: unknown[] = []) {
  const rows = await prisma.$queryRawUnsafe<T[]>(text, ...params);
  return { rows };
}

export async function execute(text: string, params: unknown[] = []) {
  return prisma.$executeRawUnsafe(text, ...params);
}
