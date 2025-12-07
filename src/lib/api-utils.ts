import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from './auth';
import prisma from './prisma';
import type { ApiResponse } from '@/types';

// Helper to get authenticated user from request
export async function getAuthUser(request: NextRequest): Promise<{
  user: JWTPayload | null;
  error: NextResponse | null;
}> {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return {
      user: null,
      error: NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    return {
      user: null,
      error: NextResponse.json<ApiResponse>(
        { success: false, error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 401 }
      ),
    };
  }

  return { user: payload, error: null };
}

// Higher-order function for protected API routes
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { user, error } = await getAuthUser(request);
    if (error) return error;
    return handler(request, user!);
  };
}

// Higher-order function for role-protected API routes
export function withRole(
  roles: string[],
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { user, error } = await getAuthUser(request);
    if (error) return error;

    if (!roles.includes(user!.role)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden: Anda tidak memiliki akses' },
        { status: 403 }
      );
    }

    return handler(request, user!);
  };
}

// Get tenant from subdomain or custom domain
export async function getTenantFromRequest(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Remove port if present
  const hostname = host.split(':')[0];

  // Check for custom domain first
  const tenantByDomain = await prisma.tenant.findFirst({
    where: {
      customDomain: hostname,
      customDomainVerified: true,
      deletedAt: null,
    },
  });

  if (tenantByDomain) {
    return tenantByDomain;
  }

  // Check for subdomain (e.g., pesantren-a.tahfidz.ai)
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost';

  if (hostname.endsWith(baseDomain)) {
    const subdomain = hostname.replace(`.${baseDomain}`, '').split('.')[0];

    if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
      const tenant = await prisma.tenant.findFirst({
        where: {
          slug: subdomain,
          deletedAt: null,
        },
      });

      return tenant;
    }
  }

  return null;
}

// Get IP address from request
export function getIPAddress(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Standard API response helpers
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
  });
}

export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Not found') {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message: string = 'Internal server error') {
  return errorResponse(message, 500);
}
