import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/hafalan/hadits - Get hadits kitab list or specific kitab/hadits
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const kitabId = searchParams.get('kitab');
  const haditsNumber = searchParams.get('number');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  try {
    // Get specific kitab with hadits
    if (kitabId) {
      const kitab = await prisma.haditsKitab.findUnique({
        where: { id: kitabId },
      });

      if (!kitab) {
        return errorResponse('Kitab hadits tidak ditemukan', 404);
      }

      // Get specific hadits or range
      if (haditsNumber || start) {
        const startNum = parseInt(haditsNumber || start || '1');
        const endNum = end ? parseInt(end) : startNum;

        const haditsList = await prisma.hadits.findMany({
          where: {
            kitabId,
            haditsNumber: { gte: startNum, lte: endNum },
          },
          orderBy: { haditsNumber: 'asc' },
        });

        const combinedText = haditsList.map((h) => h.textAr).join('\n\n');

        return successResponse({
          kitab,
          hadits: haditsList,
          combinedText,
          range: { start: startNum, end: endNum },
          total: haditsList.length,
        });
      }

      // Get all hadits in kitab (paginated)
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');

      const [haditsList, total] = await Promise.all([
        prisma.hadits.findMany({
          where: { kitabId },
          orderBy: { haditsNumber: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.hadits.count({ where: { kitabId } }),
      ]);

      return successResponse({
        kitab,
        hadits: haditsList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // Default: return list of all kitab
    const kitabs = await prisma.haditsKitab.findMany({
      where: { isActive: true },
      orderBy: { nameId: 'asc' },
    });

    return successResponse({
      kitabs,
      total: kitabs.length,
    });
  } catch (error) {
    console.error('Get Hadits error:', error);
    return errorResponse('Gagal mengambil data hadits', 500);
  }
}
