import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Create Super Admin
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@tahfidz.ai';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await prisma.user.findFirst({
    where: { email: superAdminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(superAdminPassword, 12);

    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash,
        fullName: 'Super Admin',
        role: 'super_admin',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log('✅ Super Admin created');
  } else {
    console.log('⏭️  Super Admin already exists');
  }

  // Seed Quran Surahs
  const existingSurah = await prisma.quranSurah.findFirst();

  if (!existingSurah) {
    const surahs = [
      {
        id: 1,
        nameArabic: 'الفاتحة',
        nameSimple: 'Al-Fatihah',
        nameTranslation: 'Pembukaan',
        revelationType: 'meccan',
        versesCount: 7,
      },
      {
        id: 2,
        nameArabic: 'البقرة',
        nameSimple: 'Al-Baqarah',
        nameTranslation: 'Sapi Betina',
        revelationType: 'medinan',
        versesCount: 286,
      },
      {
        id: 3,
        nameArabic: 'آل عمران',
        nameSimple: 'Ali Imran',
        nameTranslation: 'Keluarga Imran',
        revelationType: 'medinan',
        versesCount: 200,
      },
      {
        id: 4,
        nameArabic: 'النساء',
        nameSimple: 'An-Nisa',
        nameTranslation: 'Wanita',
        revelationType: 'medinan',
        versesCount: 176,
      },
      {
        id: 5,
        nameArabic: 'المائدة',
        nameSimple: 'Al-Maidah',
        nameTranslation: 'Hidangan',
        revelationType: 'medinan',
        versesCount: 120,
      },
      {
        id: 6,
        nameArabic: 'الأنعام',
        nameSimple: 'Al-Anam',
        nameTranslation: 'Binatang Ternak',
        revelationType: 'meccan',
        versesCount: 165,
      },
      {
        id: 7,
        nameArabic: 'الأعراف',
        nameSimple: 'Al-Araf',
        nameTranslation: 'Tempat Tertinggi',
        revelationType: 'meccan',
        versesCount: 206,
      },
      {
        id: 8,
        nameArabic: 'الأنفال',
        nameSimple: 'Al-Anfal',
        nameTranslation: 'Rampasan Perang',
        revelationType: 'medinan',
        versesCount: 75,
      },
      {
        id: 9,
        nameArabic: 'التوبة',
        nameSimple: 'At-Taubah',
        nameTranslation: 'Pengampunan',
        revelationType: 'medinan',
        versesCount: 129,
      },
      {
        id: 10,
        nameArabic: 'يونس',
        nameSimple: 'Yunus',
        nameTranslation: 'Yunus',
        revelationType: 'meccan',
        versesCount: 109,
      },
      // Juz Amma (30)
      {
        id: 78,
        nameArabic: 'النبأ',
        nameSimple: 'An-Naba',
        nameTranslation: 'Berita Besar',
        revelationType: 'meccan',
        versesCount: 40,
      },
      {
        id: 79,
        nameArabic: 'النازعات',
        nameSimple: 'An-Naziat',
        nameTranslation: 'Malaikat Pencabut',
        revelationType: 'meccan',
        versesCount: 46,
      },
      {
        id: 80,
        nameArabic: 'عبس',
        nameSimple: 'Abasa',
        nameTranslation: 'Bermuka Masam',
        revelationType: 'meccan',
        versesCount: 42,
      },
      {
        id: 81,
        nameArabic: 'التكوير',
        nameSimple: 'At-Takwir',
        nameTranslation: 'Menggulung',
        revelationType: 'meccan',
        versesCount: 29,
      },
      {
        id: 82,
        nameArabic: 'الانفطار',
        nameSimple: 'Al-Infitar',
        nameTranslation: 'Terbelah',
        revelationType: 'meccan',
        versesCount: 19,
      },
      {
        id: 83,
        nameArabic: 'المطففين',
        nameSimple: 'Al-Mutaffifin',
        nameTranslation: 'Orang Curang',
        revelationType: 'meccan',
        versesCount: 36,
      },
      {
        id: 84,
        nameArabic: 'الانشقاق',
        nameSimple: 'Al-Inshiqaq',
        nameTranslation: 'Terbelah',
        revelationType: 'meccan',
        versesCount: 25,
      },
      {
        id: 85,
        nameArabic: 'البروج',
        nameSimple: 'Al-Buruj',
        nameTranslation: 'Gugusan Bintang',
        revelationType: 'meccan',
        versesCount: 22,
      },
      {
        id: 86,
        nameArabic: 'الطارق',
        nameSimple: 'At-Tariq',
        nameTranslation: 'Yang Datang Malam',
        revelationType: 'meccan',
        versesCount: 17,
      },
      {
        id: 87,
        nameArabic: 'الأعلى',
        nameSimple: 'Al-Ala',
        nameTranslation: 'Yang Maha Tinggi',
        revelationType: 'meccan',
        versesCount: 19,
      },
      {
        id: 88,
        nameArabic: 'الغاشية',
        nameSimple: 'Al-Ghashiyah',
        nameTranslation: 'Hari Pembalasan',
        revelationType: 'meccan',
        versesCount: 26,
      },
      {
        id: 89,
        nameArabic: 'الفجر',
        nameSimple: 'Al-Fajr',
        nameTranslation: 'Fajar',
        revelationType: 'meccan',
        versesCount: 30,
      },
      {
        id: 90,
        nameArabic: 'البلد',
        nameSimple: 'Al-Balad',
        nameTranslation: 'Negeri',
        revelationType: 'meccan',
        versesCount: 20,
      },
      {
        id: 91,
        nameArabic: 'الشمس',
        nameSimple: 'Ash-Shams',
        nameTranslation: 'Matahari',
        revelationType: 'meccan',
        versesCount: 15,
      },
      {
        id: 92,
        nameArabic: 'الليل',
        nameSimple: 'Al-Lail',
        nameTranslation: 'Malam',
        revelationType: 'meccan',
        versesCount: 21,
      },
      {
        id: 93,
        nameArabic: 'الضحى',
        nameSimple: 'Ad-Duha',
        nameTranslation: 'Waktu Duha',
        revelationType: 'meccan',
        versesCount: 11,
      },
      {
        id: 94,
        nameArabic: 'الشرح',
        nameSimple: 'Ash-Sharh',
        nameTranslation: 'Melapangkan',
        revelationType: 'meccan',
        versesCount: 8,
      },
      {
        id: 95,
        nameArabic: 'التين',
        nameSimple: 'At-Tin',
        nameTranslation: 'Buah Tin',
        revelationType: 'meccan',
        versesCount: 8,
      },
      {
        id: 96,
        nameArabic: 'العلق',
        nameSimple: 'Al-Alaq',
        nameTranslation: 'Segumpal Darah',
        revelationType: 'meccan',
        versesCount: 19,
      },
      {
        id: 97,
        nameArabic: 'القدر',
        nameSimple: 'Al-Qadr',
        nameTranslation: 'Kemuliaan',
        revelationType: 'meccan',
        versesCount: 5,
      },
      {
        id: 98,
        nameArabic: 'البينة',
        nameSimple: 'Al-Bayyinah',
        nameTranslation: 'Bukti Nyata',
        revelationType: 'medinan',
        versesCount: 8,
      },
      {
        id: 99,
        nameArabic: 'الزلزلة',
        nameSimple: 'Az-Zalzalah',
        nameTranslation: 'Kegoncangan',
        revelationType: 'medinan',
        versesCount: 8,
      },
      {
        id: 100,
        nameArabic: 'العاديات',
        nameSimple: 'Al-Adiyat',
        nameTranslation: 'Kuda Perang',
        revelationType: 'meccan',
        versesCount: 11,
      },
      {
        id: 101,
        nameArabic: 'القارعة',
        nameSimple: 'Al-Qariah',
        nameTranslation: 'Hari Kiamat',
        revelationType: 'meccan',
        versesCount: 11,
      },
      {
        id: 102,
        nameArabic: 'التكاثر',
        nameSimple: 'At-Takathur',
        nameTranslation: 'Bermegah-megahan',
        revelationType: 'meccan',
        versesCount: 8,
      },
      {
        id: 103,
        nameArabic: 'العصر',
        nameSimple: 'Al-Asr',
        nameTranslation: 'Masa',
        revelationType: 'meccan',
        versesCount: 3,
      },
      {
        id: 104,
        nameArabic: 'الهمزة',
        nameSimple: 'Al-Humazah',
        nameTranslation: 'Pengumpat',
        revelationType: 'meccan',
        versesCount: 9,
      },
      {
        id: 105,
        nameArabic: 'الفيل',
        nameSimple: 'Al-Fil',
        nameTranslation: 'Gajah',
        revelationType: 'meccan',
        versesCount: 5,
      },
      {
        id: 106,
        nameArabic: 'قريش',
        nameSimple: 'Quraish',
        nameTranslation: 'Suku Quraisy',
        revelationType: 'meccan',
        versesCount: 4,
      },
      {
        id: 107,
        nameArabic: 'الماعون',
        nameSimple: 'Al-Maun',
        nameTranslation: 'Barang Berguna',
        revelationType: 'meccan',
        versesCount: 7,
      },
      {
        id: 108,
        nameArabic: 'الكوثر',
        nameSimple: 'Al-Kauthar',
        nameTranslation: 'Nikmat Berlimpah',
        revelationType: 'meccan',
        versesCount: 3,
      },
      {
        id: 109,
        nameArabic: 'الكافرون',
        nameSimple: 'Al-Kafirun',
        nameTranslation: 'Orang Kafir',
        revelationType: 'meccan',
        versesCount: 6,
      },
      {
        id: 110,
        nameArabic: 'النصر',
        nameSimple: 'An-Nasr',
        nameTranslation: 'Pertolongan',
        revelationType: 'medinan',
        versesCount: 3,
      },
      {
        id: 111,
        nameArabic: 'المسد',
        nameSimple: 'Al-Masad',
        nameTranslation: 'Gejolak Api',
        revelationType: 'meccan',
        versesCount: 5,
      },
      {
        id: 112,
        nameArabic: 'الإخلاص',
        nameSimple: 'Al-Ikhlas',
        nameTranslation: 'Ikhlas',
        revelationType: 'meccan',
        versesCount: 4,
      },
      {
        id: 113,
        nameArabic: 'الفلق',
        nameSimple: 'Al-Falaq',
        nameTranslation: 'Waktu Subuh',
        revelationType: 'meccan',
        versesCount: 5,
      },
      {
        id: 114,
        nameArabic: 'الناس',
        nameSimple: 'An-Nas',
        nameTranslation: 'Manusia',
        revelationType: 'meccan',
        versesCount: 6,
      },
    ];

    for (const surah of surahs) {
      await prisma.quranSurah.upsert({
        where: { id: surah.id },
        update: surah,
        create: surah,
      });
    }
    console.log('✅ Quran Surahs seeded (partial - Juz 1 & 30)');
  } else {
    console.log('⏭️  Quran Surahs already exist');
  }

  // Seed Hadits Kitab
  const existingKitab = await prisma.haditsKitab.findFirst();

  if (!existingKitab) {
    const kitabs = [
      {
        code: 'arbain',
        nameAr: 'الأربعين النووية',
        nameId: "Arba'in Nawawi",
        author: 'Imam Nawawi',
        totalHadits: 42,
        level: 'pemula',
      },
      {
        code: 'bulughul',
        nameAr: 'بلوغ المرام',
        nameId: 'Bulughul Maram',
        author: 'Ibnu Hajar al-Asqalani',
        totalHadits: 1596,
        level: 'menengah',
      },
      {
        code: 'riyadhus',
        nameAr: 'رياض الصالحين',
        nameId: 'Riyadhus Shalihin',
        author: 'Imam Nawawi',
        totalHadits: 1896,
        level: 'menengah',
      },
    ];

    for (const kitab of kitabs) {
      await prisma.haditsKitab.create({ data: kitab });
    }
    console.log('✅ Hadits Kitab seeded');
  } else {
    console.log('⏭️  Hadits Kitab already exist');
  }

  // Seed Matan Kitab
  const existingMatan = await prisma.matanKitab.findFirst();

  if (!existingMatan) {
    const matans = [
      {
        code: 'jazariyyah',
        nameAr: 'المقدمة الجزرية',
        nameId: 'Jazariyyah',
        author: 'Imam Ibnu Al-Jazari',
        category: 'tajwid',
        totalBait: 107,
        isNazham: true,
        level: 'pemula',
      },
      {
        code: 'tuhfatul',
        nameAr: 'تحفة الأطفال',
        nameId: 'Tuhfatul Athfal',
        author: 'Sulaiman Al-Jamzuri',
        category: 'tajwid',
        totalBait: 61,
        isNazham: true,
        level: 'pemula',
      },
      {
        code: 'ajrumiyyah',
        nameAr: 'الآجرومية',
        nameId: 'Al-Ajrumiyyah',
        author: 'Imam Ash-Shanhaji',
        category: 'nahwu',
        totalBait: null,
        isNazham: false,
        level: 'pemula',
      },
      {
        code: 'imrithi',
        nameAr: 'نظم العمريطي',
        nameId: 'Imrithi',
        author: 'Syaikh Syarafuddin Al-Imrithi',
        category: 'nahwu',
        totalBait: 194,
        isNazham: true,
        level: 'menengah',
      },
      {
        code: 'alfiyah',
        nameAr: 'ألفية ابن مالك',
        nameId: 'Alfiyah Ibnu Malik',
        author: 'Ibnu Malik',
        category: 'nahwu',
        totalBait: 1002,
        isNazham: true,
        level: 'lanjutan',
      },
    ];

    for (const matan of matans) {
      await prisma.matanKitab.create({ data: matan });
    }
    console.log('✅ Matan Kitab seeded');
  } else {
    console.log('⏭️  Matan Kitab already exist');
  }

  // Seed Badges
  const existingBadge = await prisma.badge.findFirst();

  if (!existingBadge) {
    const badges = [
      {
        code: 'first_setoran',
        name: 'Langkah Pertama',
        description: 'Menyelesaikan setoran pertama',
        icon: '🎯',
        category: 'general',
        requirement: { type: 'setoran_count', value: 1 },
      },
      {
        code: 'streak_7',
        name: 'Istiqomah 7 Hari',
        description: 'Setoran 7 hari berturut-turut',
        icon: '🔥',
        category: 'general',
        requirement: { type: 'streak', value: 7 },
      },
      {
        code: 'streak_30',
        name: 'Istiqomah 30 Hari',
        description: 'Setoran 30 hari berturut-turut',
        icon: '💎',
        category: 'general',
        requirement: { type: 'streak', value: 30 },
      },
      {
        code: 'juz_1',
        name: 'Hafidz Juz 1',
        description: 'Menyelesaikan hafalan Juz 1',
        icon: '📖',
        category: 'quran',
        requirement: { type: 'juz_complete', value: 1 },
      },
      {
        code: 'juz_30',
        name: 'Hafidz Juz Amma',
        description: 'Menyelesaikan hafalan Juz 30',
        icon: '🌟',
        category: 'quran',
        requirement: { type: 'juz_complete', value: 30 },
      },
      {
        code: 'arbain_complete',
        name: 'Hafidz Arbain',
        description: 'Menyelesaikan 42 hadits Arbain Nawawi',
        icon: '📚',
        category: 'hadits',
        requirement: { type: 'kitab_complete', kitab: 'arbain' },
      },
      {
        code: 'mumtaz_10',
        name: 'Mumtaz 10x',
        description: 'Mendapat nilai Mumtaz 10 kali',
        icon: '⭐',
        category: 'general',
        requirement: { type: 'grade_count', grade: 'mumtaz', value: 10 },
      },
    ];

    for (const badge of badges) {
      await prisma.badge.create({ data: badge });
    }
    console.log('✅ Badges seeded');
  } else {
    console.log('⏭️  Badges already exist');
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
