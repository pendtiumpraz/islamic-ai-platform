import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import {
  verifyRefreshToken,
  generateTokenPair,
  setAuthCookies,
  getRefreshTokenExpiry,
  clearAuthCookies,
} from '@/lib/auth';
import type { ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Also check body for refresh token (for API clients)
    let tokenToVerify = refreshToken;
    if (!tokenToVerify) {
      const body = await request.json().catch(() => ({}));
      tokenToVerify = body.refreshToken;
    }

    if (!tokenToVerify) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Refresh token tidak ditemukan.',
        },
        { status: 401 }
      );
    }

    // Verify token signature
    const payload = verifyRefreshToken(tokenToVerify);
    if (!payload) {
      await clearAuthCookies();
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Refresh token tidak valid atau sudah kadaluarsa.',
        },
        { status: 401 }
      );
    }

    // Check if token exists and not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: tokenToVerify,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { tenant: true },
        },
      },
    });

    if (!storedToken) {
      await clearAuthCookies();
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Refresh token tidak valid atau sudah digunakan.',
        },
        { status: 401 }
      );
    }

    const user = storedToken.user;

    // Check if user is still active
    if (!user.isActive || user.deletedAt) {
      await clearAuthCookies();
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Akun tidak aktif.',
        },
        { status: 403 }
      );
    }

    // Check tenant status
    if (user.tenant && user.tenant.deletedAt) {
      await clearAuthCookies();
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Lembaga tidak aktif.',
        },
        { status: 403 }
      );
    }

    // Revoke old token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email!,
      role: user.role,
      tenantId: user.tenantId || undefined,
    };
    const tokens = generateTokenPair(tokenPayload);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set cookies
    await setAuthCookies(tokens);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email!,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId || undefined,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    await clearAuthCookies();
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Terjadi kesalahan. Silakan login ulang.',
      },
      { status: 500 }
    );
  }
}
