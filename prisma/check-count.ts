import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const surahCount = await prisma.quranSurah.count();
  const ayahCount = await prisma.quranAyah.count();
  console.log('📊 Database Status:');
  console.log(`   Surahs: ${surahCount}/114`);
  console.log(`   Ayahs: ${ayahCount}/6236`);
  await prisma.$disconnect();
  await pool.end();
}
check();
