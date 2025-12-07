import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyOTP } from '@/lib/redis';
import { hashPassword } from '@/lib/password';
import { generateTokenPair, setAuthCookies, getRefreshTokenExpiry } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import type { ApiResponse, VerifyOTPRequest, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: VerifyOTPRequest = await request.json();
    const { registrationId, otp, password, fullName } = body;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Validate required fields
    if (!registrationId || !otp || !password || !fullName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Semua field wajib diisi',
        },
        { status: 400 }
      );
    }

    // Find registration attempt
    const registration = await prisma.registrationAttempt.findFirst({
      where: {
        id: registrationId,
        ipAddress: ip,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    });

    if (!registration) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Registrasi tidak ditemukan atau sudah kadaluarsa. Silakan daftar ulang.',
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpValid = await verifyOTP(registration.email!, otp);
    if (!otpValid) {
      // Increment attempt count
      await prisma.registrationAttempt.update({
        where: { id: registrationId },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
        },
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Kode OTP salah atau sudah kadaluarsa.',
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: registration.email!.toLowerCase(),
        passwordHash,
        fullName,
        role: 'user',
        emailVerified: true,
        isActive: true,
      },
    });

    // Link device fingerprint if provided
    if (registration.deviceFingerprint) {
      await prisma.deviceFingerprint.upsert({
        where: { fingerprint: registration.deviceFingerprint },
        create: {
          fingerprint: registration.deviceFingerprint,
          userId: user.id,
          ipAddresses: [ip],
        },
        update: {
          userId: user.id,
          ipAddresses: { push: ip },
          lastSeenAt: new Date(),
        },
      });
    }

    // Update registration status
    await prisma.registrationAttempt.update({
      where: { id: registrationId },
      data: {
        status: 'verified',
        verifiedAt: new Date(),
      },
    });

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

    // Set cookies
    await setAuthCookies(tokens);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email!, user.fullName).catch(console.error);

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
      message: 'Registrasi berhasil! Selamat datang di Tahfidz.ai',
      data: response,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
