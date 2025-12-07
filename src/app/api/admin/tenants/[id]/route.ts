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

// GET /api/admin/tenants/[id] - Get tenant detail
export async function GET(request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat mengakses');
  }

  const { id } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: { id },
    include: {
      users: {
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
      halaqahs: {
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          type: true,
          _count: { select: { members: true } },
        },
      },
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: { users: true, halaqahs: true },
      },
    },
  });

  if (!tenant) {
    return notFoundResponse('Tenant tidak ditemukan');
  }

  return successResponse(tenant);
}

// PUT /api/admin/tenants/[id] - Update tenant
export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat mengubah tenant');
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email, phone, plan, maxUsers, settings } = body;

    const existingTenant = await prisma.tenant.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingTenant) {
      return notFoundResponse('Tenant tidak ditemukan');
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(plan && { plan }),
        ...(maxUsers && { maxUsers }),
        ...(settings && { settings }),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_TENANT',
        targetType: 'tenant',
        targetId: tenant.id,
        performedBy: user!.userId,
        metadata: { changes: body },
      },
    });

    return successResponse(tenant, 'Tenant berhasil diupdate');
  } catch (err) {
    console.error('Update tenant error:', err);
    return errorResponse('Gagal mengupdate tenant', 500);
  }
}

// DELETE /api/admin/tenants/[id] - Soft delete tenant
export async function DELETE(request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat menghapus tenant');
  }

  const { id } = await params;

  const existingTenant = await prisma.tenant.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existingTenant) {
    return notFoundResponse('Tenant tidak ditemukan');
  }

  // Soft delete tenant and cascade to users & halaqahs
  const now = new Date();

  await prisma.$transaction([
    // Soft delete tenant
    prisma.tenant.update({
      where: { id },
      data: {
        deletedAt: now,
        deletedBy: user!.userId,
      },
    }),
    // Soft delete all users in tenant
    prisma.user.updateMany({
      where: { tenantId: id, deletedAt: null },
      data: {
        deletedAt: now,
        deletedBy: user!.userId,
      },
    }),
    // Soft delete all halaqahs in tenant
    prisma.halaqah.updateMany({
      where: { tenantId: id, deletedAt: null },
      data: {
        deletedAt: now,
        deletedBy: user!.userId,
      },
    }),
    // Create audit log
    prisma.auditLog.create({
      data: {
        action: 'SOFT_DELETE_TENANT',
        targetType: 'tenant',
        targetId: id,
        performedBy: user!.userId,
        metadata: { tenantName: existingTenant.name },
      },
    }),
  ]);

  return successResponse(null, 'Tenant berhasil dihapus (soft delete)');
}
