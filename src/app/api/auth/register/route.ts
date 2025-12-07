import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { registrationLimiter, storeOTP, generateOTP } from '@/lib/redis';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendOTPEmail } from '@/lib/email';
import { validatePasswordStrength } from '@/lib/password';
import type { ApiResponse, RegisterRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, fullName, turnstileToken, deviceFingerprint } = body;

    // Get IP address
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email, password, dan nama lengkap wajib diisi',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Format email tidak valid',
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: passwordValidation.errors.join('. '),
        },
        { status: 400 }
      );
    }

    // Verify Turnstile (CAPTCHA)
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken, ip);
      if (!turnstileValid) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
          },
          { status: 400 }
        );
      }
    }

    // Check rate limit
    const { success: rateLimitOk, remaining, reset } = await registrationLimiter.limit(ip);
    if (!rateLimitOk) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Terlalu banyak percobaan registrasi. Coba lagi dalam ${Math.ceil((reset - Date.now()) / 1000 / 60)} menit.`,
        },
        { status: 429 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.',
        },
        { status: 400 }
      );
    }

    // Check device fingerprint (if provided)
    if (deviceFingerprint) {
      const existingDevice = await prisma.deviceFingerprint.findUnique({
        where: { fingerprint: deviceFingerprint },
      });

      if (existingDevice?.userId) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Perangkat ini sudah terdaftar dengan akun lain.',
          },
          { status: 400 }
        );
      }

      if (existingDevice?.isBlocked) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Perangkat ini diblokir. Hubungi admin untuk bantuan.',
          },
          { status: 403 }
        );
      }
    }

    // Check for pending registration from same IP
    const pendingReg = await prisma.registrationAttempt.findFirst({
      where: {
        ipAddress: ip,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingReg) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            'Anda memiliki registrasi yang belum diverifikasi. Silakan cek email untuk kode OTP.',
          data: { registrationId: pendingReg.id },
        },
        { status: 400 }
      );
    }

    // Create registration attempt
    const registration = await prisma.registrationAttempt.create({
      data: {
        ipAddress: ip,
        deviceFingerprint,
        email: email.toLowerCase(),
        status: 'pending',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Generate and send OTP
    const otp = generateOTP();
    await storeOTP(email.toLowerCase(), otp);

    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      // Delete registration attempt if email fails
      await prisma.registrationAttempt.delete({
        where: { id: registration.id },
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Gagal mengirim email verifikasi. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda. Silakan verifikasi.',
      data: {
        registrationId: registration.id,
        email: email.toLowerCase(),
        remainingAttempts: remaining,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
