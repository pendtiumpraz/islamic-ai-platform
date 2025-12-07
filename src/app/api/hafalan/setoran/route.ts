import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, successResponse, errorResponse } from '@/lib/api-utils';
import { analyzeSetoran, transcribeAudio } from '@/lib/gemini';
import { aiLimiter } from '@/lib/redis';
import type { HafalanType } from '@/types';

// POST /api/hafalan/setoran - Submit setoran for AI analysis
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      hafalanType,
      surahNumber,
      ayahStart,
      ayahEnd,
      haditsKitabId,
      haditsStart,
      haditsEnd,
      matanKitabId,
      baitStart,
      baitEnd,
      audioBase64,
      halaqahId,
    } = body;

    // Validate hafalan type
    if (!['quran', 'hadits', 'matan'].includes(hafalanType)) {
      return errorResponse('Tipe hafalan tidak valid');
    }

    // Check AI rate limit
    const { success: rateLimitOk } = await aiLimiter.limit(user!.userId);
    if (!rateLimitOk) {
      return errorResponse('Terlalu banyak request AI. Coba lagi dalam 1 menit.', 429);
    }

    // Get expected text based on hafalan type
    let expectedText = '';
    let referenceInfo = { name: '', start: 0, end: 0 };

    if (hafalanType === 'quran') {
      if (!surahNumber || !ayahStart) {
        return errorResponse('Parameter surah dan ayah diperlukan untuk hafalan Quran');
      }

      const surah = await prisma.quranSurah.findUnique({
        where: { id: surahNumber },
      });

      if (!surah) {
        return errorResponse('Surah tidak ditemukan', 404);
      }

      const endAyah = ayahEnd || ayahStart;
      const ayahs = await prisma.quranAyah.findMany({
        where: {
          surahNumber,
          ayahNumber: { gte: ayahStart, lte: endAyah },
        },
        orderBy: { ayahNumber: 'asc' },
      });

      expectedText = ayahs.map((a) => a.textUthmani).join(' ');
      referenceInfo = {
        name: `${surah.nameSimple} (${surah.nameArabic})`,
        start: ayahStart,
        end: endAyah,
      };
    } else if (hafalanType === 'hadits') {
      if (!haditsKitabId || !haditsStart) {
        return errorResponse('Parameter kitab dan nomor hadits diperlukan');
      }

      const kitab = await prisma.haditsKitab.findUnique({
        where: { id: haditsKitabId },
      });

      if (!kitab) {
        return errorResponse('Kitab hadits tidak ditemukan', 404);
      }

      const endHadits = haditsEnd || haditsStart;
      const haditsList = await prisma.hadits.findMany({
        where: {
          kitabId: haditsKitabId,
          haditsNumber: { gte: haditsStart, lte: endHadits },
        },
        orderBy: { haditsNumber: 'asc' },
      });

      expectedText = haditsList.map((h) => h.textAr).join(' ');
      referenceInfo = {
        name: kitab.nameId,
        start: haditsStart,
        end: endHadits,
      };
    } else if (hafalanType === 'matan') {
      if (!matanKitabId || !baitStart) {
        return errorResponse('Parameter kitab dan nomor bait diperlukan');
      }

      const kitab = await prisma.matanKitab.findUnique({
        where: { id: matanKitabId },
      });

      if (!kitab) {
        return errorResponse('Kitab matan tidak ditemukan', 404);
      }

      const endBait = baitEnd || baitStart;
      const baits = await prisma.matanBait.findMany({
        where: {
          kitabId: matanKitabId,
          baitNumber: { gte: baitStart, lte: endBait },
        },
        orderBy: { baitNumber: 'asc' },
      });

      expectedText = baits.map((b) => b.textAr).join(' ');
      referenceInfo = {
        name: kitab.nameId,
        start: baitStart,
        end: endBait,
      };
    }

    if (!expectedText) {
      return errorResponse('Tidak ada teks yang ditemukan untuk hafalan ini');
    }

    // Transcribe audio if provided
    let transcription = '';
    if (audioBase64) {
      transcription = await transcribeAudio(audioBase64);
    }

    // Analyze setoran with AI
    const result = await analyzeSetoran({
      hafalanType: hafalanType as HafalanType,
      expectedText,
      transcription,
      referenceInfo,
    });

    // Save setoran to database
    const setoran = await prisma.setoran.create({
      data: {
        userId: user!.userId,
        halaqahId,
        hafalanType,
        // Quran
        surahNumber: hafalanType === 'quran' ? surahNumber : null,
        ayahStart: hafalanType === 'quran' ? ayahStart : null,
        ayahEnd: hafalanType === 'quran' ? ayahEnd || ayahStart : null,
        // Hadits
        haditsKitabId: hafalanType === 'hadits' ? haditsKitabId : null,
        haditsStart: hafalanType === 'hadits' ? haditsStart : null,
        haditsEnd: hafalanType === 'hadits' ? haditsEnd || haditsStart : null,
        // Matan
        matanKitabId: hafalanType === 'matan' ? matanKitabId : null,
        baitStart: hafalanType === 'matan' ? baitStart : null,
        baitEnd: hafalanType === 'matan' ? baitEnd || baitStart : null,
        // AI Results
        aiScore: result.score,
        aiGrade: result.grade,
        aiTranscription: result.transcription,
        aiSummary: result.summary,
        aiItemComments: result.itemComments as unknown as object,
        aiErrors: result.errors as unknown as object,
        aiSuggestions: result.suggestions as unknown as object,
        canContinue: result.canContinue,
        nextStart: result.nextStart,
        status: halaqahId ? 'needs_review' : 'completed',
      },
    });

    // Update hafalan progress
    await updateHafalanProgress(user!.userId, hafalanType, {
      surahNumber,
      ayahStart,
      ayahEnd,
      haditsKitabId,
      haditsStart,
      haditsEnd,
      matanKitabId,
      baitStart,
      baitEnd,
      score: result.score,
    });

    return successResponse({
      setoran,
      result,
    });
  } catch (err) {
    console.error('Setoran error:', err);
    return errorResponse('Gagal memproses setoran', 500);
  }
}

// Helper to update hafalan progress
async function updateHafalanProgress(
  userId: string,
  hafalanType: string,
  data: {
    surahNumber?: number;
    ayahStart?: number;
    ayahEnd?: number;
    haditsKitabId?: string;
    haditsStart?: number;
    haditsEnd?: number;
    matanKitabId?: string;
    baitStart?: number;
    baitEnd?: number;
    score: number;
  }
) {
  const where = {
    userId,
    hafalanType,
    ...(hafalanType === 'quran' && {
      surahNumber: data.surahNumber,
      ayahStart: data.ayahStart,
      ayahEnd: data.ayahEnd || data.ayahStart,
    }),
    ...(hafalanType === 'hadits' && {
      haditsKitabId: data.haditsKitabId,
      haditsStart: data.haditsStart,
      haditsEnd: data.haditsEnd || data.haditsStart,
    }),
    ...(hafalanType === 'matan' && {
      matanKitabId: data.matanKitabId,
      baitStart: data.baitStart,
      baitEnd: data.baitEnd || data.baitStart,
    }),
  };

  const existing = await prisma.hafalanProgress.findFirst({ where });

  if (existing) {
    // Update existing progress with spaced repetition
    const newEaseFactor = calculateEaseFactor(Number(existing.easeFactor), data.score);
    const newInterval = calculateInterval(
      existing.intervalDays,
      existing.repetitions,
      newEaseFactor,
      data.score
    );

    await prisma.hafalanProgress.update({
      where: { id: existing.id },
      data: {
        lastScore: data.score,
        lastReview: new Date(),
        nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
        easeFactor: newEaseFactor,
        intervalDays: newInterval,
        repetitions: existing.repetitions + 1,
        status: data.score >= 90 ? 'mastered' : data.score >= 70 ? 'reviewing' : 'memorizing',
      },
    });
  } else {
    // Create new progress
    await prisma.hafalanProgress.create({
      data: {
        userId,
        hafalanType,
        surahNumber: data.surahNumber,
        ayahStart: data.ayahStart,
        ayahEnd: data.ayahEnd || data.ayahStart,
        haditsKitabId: data.haditsKitabId,
        haditsStart: data.haditsStart,
        haditsEnd: data.haditsEnd || data.haditsStart,
        matanKitabId: data.matanKitabId,
        baitStart: data.baitStart,
        baitEnd: data.baitEnd || data.baitStart,
        lastScore: data.score,
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: data.score >= 90 ? 'mastered' : data.score >= 70 ? 'reviewing' : 'memorizing',
      },
    });
  }
}

// SM-2 Algorithm helpers
function calculateEaseFactor(oldEF: number, score: number): number {
  // Convert score (0-100) to quality (0-5)
  const quality = Math.round((score / 100) * 5);
  const newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(1.3, newEF);
}

function calculateInterval(
  oldInterval: number,
  repetitions: number,
  easeFactor: number,
  score: number
): number {
  if (score < 60) {
    return 1; // Reset if failed
  }

  if (repetitions === 0) {
    return 1;
  } else if (repetitions === 1) {
    return 6;
  } else {
    return Math.round(oldInterval * easeFactor);
  }
}

// GET /api/hafalan/setoran - Get user's setoran history
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const hafalanType = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const where = {
      userId: user!.userId,
      deletedAt: null,
      ...(hafalanType && { hafalanType }),
    };

    const [setorans, total] = await Promise.all([
      prisma.setoran.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.setoran.count({ where }),
    ]);

    return successResponse({
      setorans,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + setorans.length < total,
      },
    });
  } catch (err) {
    console.error('Get setoran error:', err);
    return errorResponse('Gagal mengambil data setoran', 500);
  }
}
