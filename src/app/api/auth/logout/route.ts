import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { clearAuthCookies } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Revoke refresh token if exists
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revokedAt: new Date() },
      });
    }

    // Clear cookies
    await clearAuthCookies();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Logout berhasil.',
    });
  } catch (error) {
    console.error('Logout error:', error);

    // Still clear cookies even if DB operation fails
    await clearAuthCookies();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Logout berhasil.',
    });
  }
}
