import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

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
