import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/hafalan/quran - Get Quran surahs list or specific surah
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surahId = searchParams.get('surah');
  const juz = searchParams.get('juz');
  const page = searchParams.get('page');

  try {
    // Get specific surah with ayahs
    if (surahId) {
      const surah = await prisma.quranSurah.findUnique({
        where: { id: parseInt(surahId) },
      });

      if (!surah) {
        return errorResponse('Surah tidak ditemukan', 404);
      }

      const ayahs = await prisma.quranAyah.findMany({
        where: { surahNumber: parseInt(surahId) },
        orderBy: { ayahNumber: 'asc' },
      });

      return successResponse({
        surah,
        ayahs,
        totalAyahs: ayahs.length,
      });
    }

    // Get ayahs by juz
    if (juz) {
      const ayahs = await prisma.quranAyah.findMany({
        where: { juzNumber: parseInt(juz) },
        orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
        include: {
          surah: {
            select: { nameSimple: true, nameArabic: true },
          },
        },
      });

      return successResponse({
        juz: parseInt(juz),
        ayahs,
        totalAyahs: ayahs.length,
      });
    }

    // Get ayahs by mushaf page
    if (page) {
      const ayahs = await prisma.quranAyah.findMany({
        where: { pageNumber: parseInt(page) },
        orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
        include: {
          surah: {
            select: { nameSimple: true, nameArabic: true },
          },
        },
      });

      return successResponse({
        page: parseInt(page),
        ayahs,
        totalAyahs: ayahs.length,
      });
    }

    // Default: return list of all surahs
    const surahs = await prisma.quranSurah.findMany({
      orderBy: { id: 'asc' },
    });

    return successResponse({
      surahs,
      totalSurahs: surahs.length,
    });
  } catch (error) {
    console.error('Get Quran error:', error);
    return errorResponse('Gagal mengambil data Quran', 500);
  }
}
