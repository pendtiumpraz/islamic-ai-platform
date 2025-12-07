import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/hafalan/quran/ayah - Get specific ayah(s)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = searchParams.get('surah');
  const ayahStart = searchParams.get('start');
  const ayahEnd = searchParams.get('end');

  if (!surah) {
    return errorResponse('Parameter surah diperlukan');
  }

  try {
    const surahNumber = parseInt(surah);
    const start = ayahStart ? parseInt(ayahStart) : 1;
    const end = ayahEnd ? parseInt(ayahEnd) : start;

    // Get surah info
    const surahInfo = await prisma.quranSurah.findUnique({
      where: { id: surahNumber },
    });

    if (!surahInfo) {
      return errorResponse('Surah tidak ditemukan', 404);
    }

    // Validate ayah range
    if (start < 1 || end > surahInfo.versesCount || start > end) {
      return errorResponse(
        `Range ayat tidak valid. Surah ${surahInfo.nameSimple} memiliki ${surahInfo.versesCount} ayat.`
      );
    }

    // Get ayahs in range
    const ayahs = await prisma.quranAyah.findMany({
      where: {
        surahNumber,
        ayahNumber: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { ayahNumber: 'asc' },
    });

    // Combine text for memorization
    const combinedText = ayahs.map((a) => a.textUthmani).join(' ');
    const combinedTranslation = ayahs.map((a) => a.translationId).join(' ');

    return successResponse({
      surah: surahInfo,
      range: { start, end },
      ayahs,
      combinedText,
      combinedTranslation,
      totalAyahs: ayahs.length,
    });
  } catch (error) {
    console.error('Get Ayah error:', error);
    return errorResponse('Gagal mengambil data ayat', 500);
  }
}
