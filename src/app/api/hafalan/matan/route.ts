import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/hafalan/matan - Get matan kitab list or specific kitab/bait
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kitabId = searchParams.get('kitab');
  const baitNumber = searchParams.get('number');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const category = searchParams.get('category');

  try {
    // Get specific kitab with baits
    if (kitabId) {
      const kitab = await prisma.matanKitab.findUnique({
        where: { id: kitabId },
      });

      if (!kitab) {
        return errorResponse('Kitab matan tidak ditemukan', 404);
      }

      // Get specific bait or range
      if (baitNumber || start) {
        const startNum = parseInt(baitNumber || start || '1');
        const endNum = end ? parseInt(end) : startNum;

        const baits = await prisma.matanBait.findMany({
          where: {
            kitabId,
            baitNumber: { gte: startNum, lte: endNum },
          },
          orderBy: { baitNumber: 'asc' },
        });

        const combinedText = baits.map((b) => b.textAr).join('\n');

        return successResponse({
          kitab,
          baits,
          combinedText,
          range: { start: startNum, end: endNum },
          total: baits.length,
        });
      }

      // Get all baits in kitab (paginated)
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');

      const [baits, total] = await Promise.all([
        prisma.matanBait.findMany({
          where: { kitabId },
          orderBy: { baitNumber: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.matanBait.count({ where: { kitabId } }),
      ]);

      return successResponse({
        kitab,
        baits,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // Default: return list of all kitab
    const where = {
      isActive: true,
      ...(category && { category }),
    };

    const kitabs = await prisma.matanKitab.findMany({
      where,
      orderBy: [{ category: 'asc' }, { level: 'asc' }, { nameId: 'asc' }],
    });

    // Group by category
    const grouped = kitabs.reduce(
      (acc, kitab) => {
        const cat = kitab.category || 'lainnya';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(kitab);
        return acc;
      },
      {} as Record<string, typeof kitabs>
    );

    return successResponse({
      kitabs,
      grouped,
      total: kitabs.length,
    });
  } catch (error) {
    console.error('Get Matan error:', error);
    return errorResponse('Gagal mengambil data matan', 500);
  }
}
