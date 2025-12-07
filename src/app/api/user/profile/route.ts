import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, successResponse, errorResponse } from '@/lib/api-utils';
import { hashPassword, validatePasswordStrength } from '@/lib/password';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  const profile = await prisma.user.findFirst({
    where: { id: user!.userId, deletedAt: null },
    select: {
      id: true,
      email: true,
      phone: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      isActive: true,
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: true,
      createdAt: true,
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
        },
      },
    },
  });

  if (!profile) {
    return errorResponse('User tidak ditemukan', 404);
  }

  // Get user stats
  const [setoranCount, totalProgress, badges] = await Promise.all([
    prisma.setoran.count({
      where: { userId: user!.userId, deletedAt: null },
    }),
    prisma.hafalanProgress.count({
      where: { userId: user!.userId, deletedAt: null, status: 'mastered' },
    }),
    prisma.userBadge.findMany({
      where: { userId: user!.userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    }),
  ]);

  return successResponse({
    ...profile,
    stats: {
      totalSetoran: setoranCount,
      totalMastered: totalProgress,
      totalBadges: badges.length,
    },
    badges: badges.map((ub) => ({
      ...ub.badge,
      earnedAt: ub.earnedAt,
    })),
  });
}

// PUT /api/user/profile - Update current user profile
export async function PUT(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { fullName, phone, avatarUrl, currentPassword, newPassword } = body;

    const existingUser = await prisma.user.findFirst({
      where: { id: user!.userId, deletedAt: null },
    });

    if (!existingUser) {
      return errorResponse('User tidak ditemukan', 404);
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse('Password lama wajib diisi untuk mengganti password');
      }

      // Verify current password
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(currentPassword, existingUser.passwordHash || '');

      if (!isValid) {
        return errorResponse('Password lama tidak sesuai');
      }

      // Validate new password strength
      const validation = validatePasswordStrength(newPassword);
      if (!validation.valid) {
        return errorResponse(validation.errors.join('. '));
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user!.userId },
        data: { passwordHash: newPasswordHash },
      });
    }

    // Update profile
    const updatedUser = await prisma.user.update({
      where: { id: user!.userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
    });

    return successResponse(updatedUser, 'Profile berhasil diupdate');
  } catch (err) {
    console.error('Update profile error:', err);
    return errorResponse('Gagal mengupdate profile', 500);
  }
}
