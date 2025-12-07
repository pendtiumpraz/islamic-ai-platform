import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Note: Soft delete is handled at query level in Prisma 7+
// Use prisma.model.findMany({ where: { deletedAt: null } }) pattern
// Or use Prisma Client extensions for automatic filtering

export default prisma;

// Helper to add soft delete filter
export function withSoftDelete<T extends { deletedAt?: Date | null }>(
  where: T
): T & { deletedAt: null } {
  return { ...where, deletedAt: null };
}
