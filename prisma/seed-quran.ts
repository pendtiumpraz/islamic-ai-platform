import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const GITHUB_BASE_URL =
  'https://raw.githubusercontent.com/ianoit/Al-Quran-JSON-Indonesia-Kemenag/master';

interface SurahData {
  id: number;
  surat_name: string;
  surat_text: string;
  surat_terjemahan: string;
  count_ayat: number;
}

interface AyahData {
  aya_id: number;
  aya_number: number;
  aya_text: string;
  sura_id: number;
  juz_id: number;
  page_number: number;
  translation_aya_text: string;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

async function seedSurahs() {
  console.log('📖 Fetching Daftar Surat...');

  const surahList = await fetchJSON<{ data: SurahData[] }>(
    `${GITHUB_BASE_URL}/Daftar%20Surat.json`
  );

  console.log(`📖 Found ${surahList.data.length} surahs`);

  // Determine revelation type based on surah number (simplified)
  const meccanSurahs = [
    1, 6, 7, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 56, 67, 68, 69, 70, 71, 72, 73,
    74, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100,
    101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114,
  ];

  for (const surah of surahList.data) {
    await prisma.quranSurah.upsert({
      where: { id: surah.id },
      update: {
        nameArabic: surah.surat_text.trim(),
        nameSimple: surah.surat_name,
        nameTranslation: surah.surat_terjemahan,
        versesCount: surah.count_ayat,
        revelationType: meccanSurahs.includes(surah.id) ? 'meccan' : 'medinan',
      },
      create: {
        id: surah.id,
        nameArabic: surah.surat_text.trim(),
        nameSimple: surah.surat_name,
        nameTranslation: surah.surat_terjemahan,
        versesCount: surah.count_ayat,
        revelationType: meccanSurahs.includes(surah.id) ? 'meccan' : 'medinan',
      },
    });
    process.stdout.write(`\r✅ Surah ${surah.id}/114 - ${surah.surat_name}`);
  }
  console.log('\n✅ All surahs seeded!');
}

async function seedAyahs() {
  console.log('📖 Fetching Ayahs for all surahs...');

  // Check existing ayahs to skip already seeded surahs
  const existingAyahs = await prisma.quranAyah.groupBy({
    by: ['surahNumber'],
    _count: true,
  });
  const seededSurahs = new Set(existingAyahs.map((a) => a.surahNumber));

  for (let surahId = 1; surahId <= 114; surahId++) {
    // Skip if already fully seeded (check count matches)
    const surah = await prisma.quranSurah.findUnique({ where: { id: surahId } });
    const existingCount = existingAyahs.find((a) => a.surahNumber === surahId)?._count || 0;

    if (surah && existingCount >= surah.versesCount) {
      process.stdout.write(`\r⏭️  Surah ${surahId}/114 - already seeded (${existingCount} ayahs)`);
      continue;
    }

    try {
      const ayahData = await fetchJSON<{ data: AyahData[] }>(
        `${GITHUB_BASE_URL}/Surat/${surahId}.json`
      );

      // Batch insert using createMany (faster)
      const ayahsToCreate = ayahData.data.map((ayah) => ({
        surahNumber: surahId,
        ayahNumber: ayah.aya_number,
        textUthmani: ayah.aya_text,
        translationId: ayah.translation_aya_text
          .replace(/<\/?p>/g, '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .trim(),
        juzNumber: ayah.juz_id,
        pageNumber: ayah.page_number,
      }));

      // Delete existing and recreate (faster than upsert for batch)
      await prisma.quranAyah.deleteMany({ where: { surahNumber: surahId } });
      await prisma.quranAyah.createMany({ data: ayahsToCreate });

      process.stdout.write(`\r✅ Surah ${surahId}/114 - ${ayahData.data.length} ayahs          `);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`\n❌ Error seeding surah ${surahId}:`, error);
    }
  }
  console.log('\n✅ All ayahs seeded!');
}

async function main() {
  console.log('🌱 Starting Quran seed from Kemenag JSON...\n');

  try {
    // Seed surahs first
    await seedSurahs();

    // Then seed ayahs
    await seedAyahs();

    // Count results
    const surahCount = await prisma.quranSurah.count();
    const ayahCount = await prisma.quranAyah.count();

    console.log(`\n📊 Summary:`);
    console.log(`   - Surahs: ${surahCount}`);
    console.log(`   - Ayahs: ${ayahCount}`);
    console.log('\n🌱 Quran seed completed!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
