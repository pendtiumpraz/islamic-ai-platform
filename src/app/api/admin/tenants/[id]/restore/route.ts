import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthUser,
  successResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-utils';

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/admin/tenants/[id]/restore - Restore soft deleted tenant
export async function POST(request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat restore tenant');
  }

  const { id } = await params;

  // Find deleted tenant (include deleted)
  const deletedTenant = await prisma.tenant.findFirst({
    where: {
      id,
      deletedAt: { not: null },
    },
  });

  if (!deletedTenant) {
    return notFoundResponse('Tenant tidak ditemukan di trash');
  }

  // Check if within 30 days
  const deletedAt = deletedTenant.deletedAt!;
  const daysSinceDelete = Math.floor((Date.now() - deletedAt.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceDelete > 30) {
    return errorResponse('Tenant sudah melewati batas 30 hari dan tidak dapat di-restore');
  }

  try {
    await prisma.$transaction([
      // Restore tenant
      prisma.tenant.update({
        where: { id },
        data: {
          deletedAt: null,
          deletedBy: null,
        },
      }),
      // Restore all users that were deleted at same time
      prisma.user.updateMany({
        where: {
          tenantId: id,
          deletedAt: deletedAt,
        },
        data: {
          deletedAt: null,
          deletedBy: null,
        },
      }),
      // Restore all halaqahs that were deleted at same time
      prisma.halaqah.updateMany({
        where: {
          tenantId: id,
          deletedAt: deletedAt,
        },
        data: {
          deletedAt: null,
          deletedBy: null,
        },
      }),
      // Create audit log
      prisma.auditLog.create({
        data: {
          action: 'RESTORE_TENANT',
          targetType: 'tenant',
          targetId: id,
          performedBy: user!.userId,
          metadata: {
            tenantName: deletedTenant.name,
            daysInTrash: daysSinceDelete,
          },
        },
      }),
    ]);

    return successResponse(null, 'Tenant berhasil di-restore');
  } catch (err) {
    console.error('Restore tenant error:', err);
    return errorResponse('Gagal restore tenant', 500);
  }
}
