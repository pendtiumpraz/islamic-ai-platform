import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, successResponse, errorResponse } from '@/lib/api-utils';

// GET /api/hafalan/progress - Get user's hafalan progress
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const hafalanType = searchParams.get('type');
  const status = searchParams.get('status');

  try {
    const where = {
      userId: user!.userId,
      deletedAt: null,
      ...(hafalanType && { hafalanType }),
      ...(status && { status }),
    };

    const progress = await prisma.hafalanProgress.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    // Calculate summary stats
    const stats = {
      quran: {
        total: 0,
        memorizing: 0,
        reviewing: 0,
        mastered: 0,
        totalAyahs: 0,
      },
      hadits: {
        total: 0,
        memorizing: 0,
        reviewing: 0,
        mastered: 0,
        totalHadits: 0,
      },
      matan: {
        total: 0,
        memorizing: 0,
        reviewing: 0,
        mastered: 0,
        totalBaits: 0,
      },
    };

    for (const p of progress) {
      const type = p.hafalanType as keyof typeof stats;
      stats[type].total++;

      if (p.status === 'memorizing') stats[type].memorizing++;
      else if (p.status === 'reviewing') stats[type].reviewing++;
      else if (p.status === 'mastered') stats[type].mastered++;

      if (type === 'quran' && p.ayahStart && p.ayahEnd) {
        stats.quran.totalAyahs += p.ayahEnd - p.ayahStart + 1;
      } else if (type === 'hadits' && p.haditsStart && p.haditsEnd) {
        stats.hadits.totalHadits += p.haditsEnd - p.haditsStart + 1;
      } else if (type === 'matan' && p.baitStart && p.baitEnd) {
        stats.matan.totalBaits += p.baitEnd - p.baitStart + 1;
      }
    }

    return successResponse({
      progress,
      stats,
      total: progress.length,
    });
  } catch (err) {
    console.error('Get progress error:', err);
    return errorResponse('Gagal mengambil data progress', 500);
  }
}

// GET /api/hafalan/progress/due - Get items due for review (muroja'ah)
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const hafalanType = searchParams.get('type');

  try {
    const now = new Date();

    const dueItems = await prisma.hafalanProgress.findMany({
      where: {
        userId: user!.userId,
        deletedAt: null,
        nextReview: { lte: now },
        status: { in: ['reviewing', 'mastered'] },
        ...(hafalanType && { hafalanType }),
      },
      orderBy: { nextReview: 'asc' },
      take: 10, // Limit to 10 items per session
    });

    // Enrich with content info
    const enrichedItems = await Promise.all(
      dueItems.map(async (item) => {
        let contentInfo = {};

        if (item.hafalanType === 'quran' && item.surahNumber) {
          const surah = await prisma.quranSurah.findUnique({
            where: { id: item.surahNumber },
          });
          contentInfo = {
            surahName: surah?.nameSimple,
            surahArabic: surah?.nameArabic,
          };
        } else if (item.hafalanType === 'hadits' && item.haditsKitabId) {
          const kitab = await prisma.haditsKitab.findUnique({
            where: { id: item.haditsKitabId },
          });
          contentInfo = { kitabName: kitab?.nameId };
        } else if (item.hafalanType === 'matan' && item.matanKitabId) {
          const kitab = await prisma.matanKitab.findUnique({
            where: { id: item.matanKitabId },
          });
          contentInfo = { kitabName: kitab?.nameId };
        }

        return { ...item, ...contentInfo };
      })
    );

    return successResponse({
      dueItems: enrichedItems,
      total: enrichedItems.length,
    });
  } catch (err) {
    console.error('Get due items error:', err);
    return errorResponse("Gagal mengambil jadwal muroja'ah", 500);
  }
}
