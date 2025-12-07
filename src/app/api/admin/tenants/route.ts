import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, successResponse, errorResponse, forbiddenResponse } from '@/lib/api-utils';
import type { ApiResponse } from '@/types';

// GET /api/admin/tenants - List all tenants
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat mengakses');
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  const where = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      include: {
        _count: {
          select: { users: true, halaqahs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tenant.count({ where }),
  ]);

  return successResponse({
    tenants,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/admin/tenants - Create new tenant
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  if (user!.role !== 'super_admin') {
    return forbiddenResponse('Hanya super admin yang dapat membuat tenant');
  }

  try {
    const body = await request.json();
    const { name, slug, email, phone, plan, maxUsers } = body;

    // Validate required fields
    if (!name || !slug || !email) {
      return errorResponse('Nama, slug, dan email wajib diisi');
    }

    // Check slug uniqueness
    const existingSlug = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return errorResponse('Slug sudah digunakan');
    }

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug: slug.toLowerCase(),
        email,
        phone,
        plan: plan || 'free',
        maxUsers: maxUsers || 5,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_TENANT',
        targetType: 'tenant',
        targetId: tenant.id,
        performedBy: user!.userId,
        metadata: { tenantName: name },
      },
    });

    return successResponse(tenant, 'Tenant berhasil dibuat');
  } catch (err) {
    console.error('Create tenant error:', err);
    return errorResponse('Gagal membuat tenant', 500);
  }
}
