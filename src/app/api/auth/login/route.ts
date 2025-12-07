import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { loginLimiter } from '@/lib/redis';
import { verifyPassword } from '@/lib/password';
import { verifyTurnstile } from '@/lib/turnstile';
import { generateTokenPair, setAuthCookies, getRefreshTokenExpiry } from '@/lib/auth';
import type { ApiResponse, LoginRequest, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password, turnstileToken } = body;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email dan password wajib diisi',
        },
        { status: 400 }
      );
    }

    // Check rate limit
    const { success: rateLimitOk, reset } = await loginLimiter.limit(ip);
    if (!rateLimitOk) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil((reset - Date.now()) / 1000 / 60)} menit.`,
        },
        { status: 429 }
      );
    }

    // Verify Turnstile (if provided)
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken, ip);
      if (!turnstileValid) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Verifikasi CAPTCHA gagal.',
          },
          { status: 400 }
        );
      }
    }

    // Find user (include soft deleted check manually for login)
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email atau password salah.',
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Akun Anda dinonaktifkan. Hubungi admin untuk bantuan.',
        },
        { status: 403 }
      );
    }

    // Verify password
    if (!user.passwordHash) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Akun tidak memiliki password. Silakan reset password.',
        },
        { status: 400 }
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email atau password salah.',
        },
        { status: 401 }
      );
    }

    // Check tenant status (if user belongs to a tenant)
    if (user.tenant && user.tenant.deletedAt) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Lembaga Anda sudah tidak aktif. Hubungi admin untuk bantuan.',
        },
        { status: 403 }
      );
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email!,
      role: user.role,
      tenantId: user.tenantId || undefined,
    };
    const tokens = generateTokenPair(tokenPayload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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
      message: 'Login berhasil!',
      data: response,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
