# Ta'lim App Requirements - Islamic AI Platform

## Overview

Aplikasi pembelajaran ilmu Islam berbasis AI dengan fokus pada **manhaj Salaf** (Ahlus Sunnah wal Jama'ah). Platform untuk belajar aqidah, fiqih, hadits, tafsir, dan ilmu-ilmu syar'i lainnya.

---

## App Identity

| Item        | Value                                  |
| ----------- | -------------------------------------- |
| Nama        | **Ta'lim.ai** atau **Tholibul Ilmi**   |
| Tagline     | "Belajar Islam dengan Pemahaman Salaf" |
| Target User | Muslim umum, Penuntut ilmu, Mualaf     |
| Manhaj      | Salafi (Ahlus Sunnah wal Jama'ah)      |

---

## Sumber Ilmu & Referensi

### Ulama Rujukan

**Ulama Klasik (Salafus Shalih):**

- Imam Ahmad bin Hanbal
- Imam Ibnu Taimiyyah
- Imam Ibnul Qayyim Al-Jauziyyah
- Imam Muhammad bin Abdul Wahhab
- Imam Ash-Syaukani

**Ulama Kontemporer:**

- Syaikh Abdul Aziz bin Baz
- Syaikh Muhammad bin Shalih Al-Utsaimin
- Syaikh Muhammad Nashiruddin Al-Albani
- Syaikh Shalih Al-Fauzan
- Syaikh Abdul Muhsin Al-Abbad

### Kitab Rujukan

| Kategori   | Kitab                                                                            |
| ---------- | -------------------------------------------------------------------------------- |
| **Aqidah** | Al-Ushul Ats-Tsalatsah, Kitab At-Tauhid, Al-Qawa'id Al-Arba', Aqidah Wasithiyyah |
| **Fiqih**  | Umdatul Ahkam, Bulughul Maram, Fiqhus Sunnah                                     |
| **Hadits** | Shahih Bukhari, Shahih Muslim, Riyadhus Shalihin, Arba'in Nawawi                 |
| **Tafsir** | Tafsir Ibnu Katsir, Tafsir As-Sa'di                                              |
| **Sirah**  | Ar-Rahiq Al-Makhtum, Fiqhus Sirah                                                |
| **Akhlak** | Riyadhus Shalihin, Adabul Mufrad                                                 |

---

## Tech Stack (Mobile)

| Layer       | Technology               |
| ----------- | ------------------------ |
| Framework   | React Native / Expo      |
| Language    | TypeScript               |
| State       | Zustand + TanStack Query |
| Navigation  | Expo Router              |
| Audio/Video | expo-av                  |
| Storage     | AsyncStorage + SQLite    |
| AI          | Gemini 2.0 Flash API     |

---

## Core Features

### 1. AI Ustadz (Islamic Chatbot)

**Fitur Utama:**

- Tanya jawab seputar Islam 24/7
- Jawaban berdasarkan dalil (Quran & Hadits shahih)
- Rujukan ke pendapat ulama Salaf
- Multi-bahasa (Indonesia, Arab, Inggris)

**Batasan & Guidelines:**

```typescript
const AI_SYSTEM_PROMPT = `
Anda adalah asisten pembelajaran Islam yang mengikuti manhaj Salaf (Ahlus Sunnah wal Jama'ah).

PRINSIP:
1. Berpegang pada Al-Quran dan As-Sunnah dengan pemahaman Salafus Shalih
2. Merujuk kepada ulama yang diakui (Ibnu Taimiyyah, Ibnul Qayyim, Syaikh Bin Baz, Syaikh Utsaimin, Syaikh Albani)
3. Menghindari bid'ah, khurafat, dan pemahaman menyimpang
4. Tidak membahas politik praktis dan khilafiyah yang memecah belah
5. Jika tidak tahu, katakan "Allahu a'lam" dan sarankan bertanya ke ulama

FORMAT JAWABAN:
1. Jawab dengan dalil dari Al-Quran dan Hadits shahih
2. Sertakan pendapat ulama jika relevan
3. Gunakan bahasa yang mudah dipahami
4. Jika ada ikhtilaf (perbedaan pendapat), jelaskan pendapat yang rajih (kuat) menurut dalil

TOPIK YANG BISA DIJAWAB:
- Aqidah (tauhid, asma wa sifat, iman, dll)
- Ibadah (shalat, puasa, zakat, haji, dll)
- Muamalah (jual beli, pernikahan, waris, dll)
- Akhlak dan adab
- Sirah Nabi dan sahabat
- Hadits dan ilmu hadits
- Tafsir Al-Quran

TOPIK YANG TIDAK DIJAWAB:
- Politik praktis dan pilihan partai
- Mengkafirkan individu atau kelompok tertentu
- Hal-hal yang memerlukan fatwa khusus (wajib tanya ulama langsung)
- Ramalan, mistik, dan hal-hal ghaib di luar dalil
`;
```

**AI Chat Implementation:**

```typescript
// services/islamicAI.ts
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface IslamicResponse {
  answer: string;
  dalil: {
    quran?: { surah: string; ayat: number; text: string }[];
    hadits?: { kitab: string; nomor: number; text: string; derajat: string }[];
  };
  references: {
    ulama: string;
    kitab: string;
    quote?: string;
  }[];
  relatedTopics: string[];
}

async function askIslamicQuestion(
  question: string,
  history: ChatMessage[] = []
): Promise<IslamicResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: AI_SYSTEM_PROMPT,
  });

  const chat = model.startChat({ history });

  const prompt = `
Pertanyaan: ${question}

Jawab dalam format JSON:
{
  "answer": "jawaban lengkap",
  "dalil": {
    "quran": [{ "surah": "nama surah", "ayat": nomor, "text": "teks ayat" }],
    "hadits": [{ "kitab": "nama kitab", "nomor": nomor, "text": "teks hadits", "derajat": "shahih/hasan" }]
  },
  "references": [{ "ulama": "nama ulama", "kitab": "nama kitab", "quote": "kutipan jika ada" }],
  "relatedTopics": ["topik terkait 1", "topik terkait 2"]
}
`;

  const result = await chat.sendMessage(prompt);
  return JSON.parse(result.response.text());
}
```

---

### 2. Kalkulator Waris (Faraid)

**Fitur:**

- Input ahli waris lengkap
- Hitung pembagian otomatis sesuai Al-Quran
- Penjelasan dalil setiap pembagian
- Handle kasus khusus (aul, radd, hajb)
- Export hasil ke PDF

**Ahli Waris & Bagian:**

```typescript
const WARITS_SHARES = {
  // Dzawil Furudh (bagian tetap)
  suami: { condition: 'no_children', share: '1/2' },
  suami_with_children: { condition: 'has_children', share: '1/4' },
  istri: { condition: 'no_children', share: '1/4' },
  istri_with_children: { condition: 'has_children', share: '1/8' },
  ayah: { condition: 'has_children', share: '1/6' },
  ibu: { condition: 'no_children_no_siblings', share: '1/3' },
  ibu_with_children: { condition: 'has_children', share: '1/6' },
  anak_perempuan: { condition: 'single_no_son', share: '1/2' },
  anak_perempuan_multiple: { condition: 'multiple_no_son', share: '2/3' },
  // ... dan seterusnya

  // Ashabah (sisa)
  anak_laki: 'ashabah',
  ayah_no_children: 'ashabah',
  saudara_laki_sekandung: 'ashabah',
  // ... dan seterusnya
};

interface WarisInput {
  totalHarta: number;
  currency: string;

  // Ahli waris
  suami: boolean;
  istri: number; // jumlah istri (1-4)
  ayah: boolean;
  ibu: boolean;
  kakek: boolean;
  nenek_dari_ayah: boolean;
  nenek_dari_ibu: boolean;

  anak_laki: number;
  anak_perempuan: number;
  cucu_laki_dari_anak_laki: number;
  cucu_perempuan_dari_anak_laki: number;

  saudara_laki_sekandung: number;
  saudara_perempuan_sekandung: number;
  saudara_laki_seayah: number;
  saudara_perempuan_seayah: number;
  saudara_laki_seibu: number;
  saudara_perempuan_seibu: number;

  // Wasiat & hutang
  wasiat: number; // max 1/3
  hutang: number;
  biayaPengurusan: number;
}

interface WarisResult {
  summary: {
    totalHarta: number;
    dikurangiHutang: number;
    dikurangiWasiat: number;
    dikurangiBiaya: number;
    hartaWarisan: number;
  };

  pembagian: {
    ahliWaris: string;
    bagian: string;
    nominal: number;
    dalil: string;
    penjelasan: string;
  }[];

  keterangan: {
    kasusKhusus?: string; // aul, radd, dll
    penjelasan: string;
  };
}
```

**UI Flow:**

```
┌─────────────────────────────────────────┐
│ ←  Kalkulator Waris (Faraid)            │
├─────────────────────────────────────────┤
│                                         │
│  Step 1: Data Harta                     │
│  ┌─────────────────────────────────┐   │
│  │ Total Harta: Rp [___________]   │   │
│  │ Hutang:      Rp [___________]   │   │
│  │ Wasiat:      Rp [___________]   │   │
│  │ Biaya:       Rp [___________]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Step 2: Ahli Waris                     │
│  ┌─────────────────────────────────┐   │
│  │ ☐ Suami                         │   │
│  │ ☐ Istri  Jumlah: [1]            │   │
│  │ ☐ Ayah                          │   │
│  │ ☐ Ibu                           │   │
│  │ Anak laki-laki:    [0]          │   │
│  │ Anak perempuan:    [0]          │   │
│  │ Saudara laki-laki: [0]          │   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Hitung Pembagian        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3. Kalkulator Zakat

**Jenis Zakat:**

| Jenis                         | Nisab               | Kadar                  |
| ----------------------------- | ------------------- | ---------------------- |
| Zakat Emas                    | 85 gram emas        | 2.5%                   |
| Zakat Perak                   | 595 gram perak      | 2.5%                   |
| Zakat Uang/Tabungan           | Setara 85 gram emas | 2.5%                   |
| Zakat Perdagangan             | Setara 85 gram emas | 2.5%                   |
| Zakat Pertanian (tadah hujan) | 653 kg gabah        | 10%                    |
| Zakat Pertanian (irigasi)     | 653 kg gabah        | 5%                     |
| Zakat Fitrah                  | -                   | 2.5-3 kg makanan pokok |
| Zakat Profesi\*               | Setara 85 gram emas | 2.5%                   |

\*Khilafiyah - ada penjelasan perbedaan pendapat

**Implementation:**

```typescript
interface ZakatInput {
  type: 'maal' | 'fitrah' | 'profesi' | 'pertanian' | 'emas' | 'perdagangan';

  // For maal/emas
  totalSavings?: number;
  goldGrams?: number;
  silverGrams?: number;
  investments?: number;
  receivables?: number; // piutang

  // For profesi
  monthlyIncome?: number;
  monthlyExpenses?: number;

  // For pertanian
  harvestKg?: number;
  irrigationType?: 'rain' | 'irrigation' | 'mixed';

  // For fitrah
  numberOfPeople?: number;
  riceKgPerPerson?: number;

  // Reference prices
  goldPricePerGram?: number;
  ricePricePerKg?: number;
}

interface ZakatResult {
  isWajib: boolean;
  nisab: {
    amount: number;
    equivalent: string;
  };
  totalHarta: number;
  zakatAmount: number;
  calculation: string;
  dalil: string[];
  notes: string[];
}
```

---

### 4. Perpustakaan Digital (Maktabah)

**Konten:**

- Kitab-kitab salaf (teks Arab + terjemahan)
- Artikel dan makalah ilmiah
- Fatwa ulama
- Kajian audio/video

**Features:**

- Search dalam kitab
- Bookmark & highlight
- Notes
- Offline reading
- Text-to-speech Arab

**Database Schema:**

```sql
-- Kitab/Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar VARCHAR(255),
  title_id VARCHAR(255),
  author_ar VARCHAR(255),
  author_id VARCHAR(255),
  category VARCHAR(100), -- aqidah, fiqih, hadits, tafsir, etc
  description TEXT,
  cover_url TEXT,
  is_free BOOLEAN DEFAULT true,
  total_pages INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Book Content (per page/chapter)
CREATE TABLE book_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id),
  chapter_number INTEGER,
  chapter_title VARCHAR(255),
  page_number INTEGER,
  content_ar TEXT,
  content_id TEXT, -- terjemahan
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  page_number INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fatwa
CREATE TABLE fatwa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ulama VARCHAR(255),
  source VARCHAR(255),
  category VARCHAR(100),
  dalil JSONB, -- array of dalil
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 5. Kursus & Materi Belajar

**Kurikulum Tersedia:**

**Level 1: Pemula (Mubtadi)**

1. Aqidah Dasar (Al-Ushul Ats-Tsalatsah)
2. Thaharah & Shalat
3. Puasa & Zakat
4. Akhlak Muslim
5. Sirah Nabi (ringkas)

**Level 2: Menengah (Mutawassith)**

1. Aqidah Wasithiyyah
2. Fiqih Ibadah (Umdatul Ahkam)
3. Hadits Arba'in Nawawi
4. Ushul Fiqih Dasar
5. Ulumul Quran Dasar

**Level 3: Lanjutan (Mutaqaddim)**

1. Kitab At-Tauhid
2. Bulughul Maram
3. Tafsir (pilihan surah)
4. Mustalah Hadits
5. Ushul Fiqih Lanjutan

**Course Structure:**

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor?: string;
  thumbnailUrl: string;
  totalLessons: number;
  totalDuration: number; // minutes

  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'text' | 'quiz';
  content: {
    videoUrl?: string;
    audioUrl?: string;
    textContent?: string;
    quiz?: Quiz;
  };
  duration: number;
  order: number;
}

interface Quiz {
  questions: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    dalil?: string;
  }[];
  passingScore: number;
}
```

**Progress Tracking:**

```sql
-- User course enrollment
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'not_started',
  completed_at TIMESTAMP,
  quiz_score INTEGER,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);
```

---

### 6. Kalender Hijriyah & Pengingat Ibadah

**Features:**

- Kalender Hijriyah akurat
- Waktu shalat berdasarkan lokasi
- Pengingat puasa sunnah
- Hari-hari penting Islam
- Dzikir pagi/petang dengan audio

**Puasa Sunnah:**

- Senin & Kamis
- Ayyamul Bidh (13, 14, 15 Hijriyah)
- Puasa Daud (selang-seling)
- Puasa Asyura (9-10 Muharram)
- Puasa Arafah (9 Dzulhijjah)
- 6 hari Syawal

**Implementation:**

```typescript
interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface IslamicDate {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hijriMonthName: string;
  gregorianDate: Date;
}

interface SunnahFasting {
  date: Date;
  hijriDate: IslamicDate;
  type: 'monday_thursday' | 'ayyamul_bidh' | 'ashura' | 'arafah' | 'syawal';
  description: string;
  dalil: string;
}
```

---

### 7. Scan & Terjemah Kitab (Vision AI)

**Features:**

- Foto halaman kitab Arab
- OCR teks Arab
- Terjemahan otomatis
- Penjelasan kosakata sulit

**Implementation:**

```typescript
async function scanAndTranslate(imageBase64: string): Promise<ScanResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
Analisis gambar kitab Arab ini:
1. Ekstrak teks Arab dengan akurat
2. Terjemahkan ke Bahasa Indonesia
3. Jelaskan kata-kata sulit
4. Identifikasi kitab jika memungkinkan

Format output (JSON):
{
  "arabicText": "teks arab asli",
  "translation": "terjemahan Indonesia",
  "vocabulary": [
    { "word": "kata arab", "meaning": "arti", "explanation": "penjelasan" }
  ],
  "bookInfo": {
    "title": "nama kitab jika diketahui",
    "author": "penulis jika diketahui"
  }
}
`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
  ]);

  return JSON.parse(result.response.text());
}
```

---

### 8. Ruqyah Syar'iyyah Guide

**Konten:**

- Panduan ruqyah mandiri
- Ayat-ayat ruqyah dengan audio
- Doa-doa perlindungan
- Adab dan tata cara

**Disclaimer:**

- Bukan pengganti pengobatan medis
- Rujukan ke ulama untuk kasus berat
- Berdasarkan dalil shahih saja

---

## Screen Wireframes

### Home Screen

```
┌─────────────────────────────────────────┐
│ ☰  Ta'lim.ai                      👤    │
├─────────────────────────────────────────┤
│                                         │
│  Assalamu'alaikum, Ahmad! 👋            │
│  "Barangsiapa menempuh jalan untuk      │
│   mencari ilmu, Allah mudahkan..."      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📚 Kursus Aktif: 2             │   │
│  │  ✅ Pelajaran Selesai: 15       │   │
│  │  🔥 Streak: 7 hari              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🤖 Tanya AI Ustadz                     │
│  ┌─────────────────────────────────┐   │
│  │ Ketik pertanyaan Anda...     🎤 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📖 Fitur Utama                         │
│  ┌──────────┐ ┌──────────┐            │
│  │ 📚       │ │ 🧮       │            │
│  │ Kursus   │ │ Waris    │            │
│  └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐            │
│  │ 💰       │ │ 📖       │            │
│  │ Zakat    │ │ Maktabah │            │
│  └──────────┘ └──────────┘            │
│                                         │
│  🕌 Waktu Shalat - Jakarta              │
│  Dzuhur: 12:05 (dalam 2 jam)           │
│                                         │
├─────────────────────────────────────────┤
│  🏠    📚    🤖    📖    👤            │
└─────────────────────────────────────────┘
```

### AI Chat Screen

```
┌─────────────────────────────────────────┐
│ ←  AI Ustadz                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Apa hukum shalat Jumat bagi  │   │
│  │    musafir?                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🤖 Bismillah, menurut pendapat  │   │
│  │    yang rajih (kuat), shalat    │   │
│  │    Jumat tidak wajib bagi       │   │
│  │    musafir.                     │   │
│  │                                 │   │
│  │    📖 Dalil:                    │   │
│  │    Hadits Jabir: "Barangsiapa   │   │
│  │    beriman kepada Allah..."     │   │
│  │    (HR. Bukhari & Muslim)       │   │
│  │                                 │   │
│  │    📚 Referensi:                │   │
│  │    - Syaikh Utsaimin,           │   │
│  │      Syarhul Mumti' 5/7         │   │
│  │    - Syaikh Bin Baz,            │   │
│  │      Majmu' Fatawa 12/381       │   │
│  │                                 │   │
│  │    🔗 Topik Terkait:            │   │
│  │    • Jama' & Qashar             │   │
│  │    • Definisi Musafir           │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Ketik pertanyaan...          📤 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Waris Calculator Result

```
┌─────────────────────────────────────────┐
│ ←  Hasil Perhitungan Waris              │
├─────────────────────────────────────────┤
│                                         │
│  💰 Ringkasan Harta                     │
│  ┌─────────────────────────────────┐   │
│  │ Total Harta:      Rp 1.000.000.000│  │
│  │ Hutang:           Rp    50.000.000│  │
│  │ Wasiat (1/3 max): Rp   100.000.000│  │
│  │ ─────────────────────────────────│  │
│  │ Harta Warisan:    Rp   850.000.000│  │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 Pembagian Warisan                   │
│  ┌─────────────────────────────────┐   │
│  │ Istri (1/8):                    │   │
│  │ Rp 106.250.000                  │   │
│  │ 📖 QS. An-Nisa: 12              │   │
│  ├─────────────────────────────────┤   │
│  │ Ibu (1/6):                      │   │
│  │ Rp 141.666.667                  │   │
│  │ 📖 QS. An-Nisa: 11              │   │
│  ├─────────────────────────────────┤   │
│  │ Anak laki-laki x2 (Ashabah):    │   │
│  │ Rp 401.388.889 (masing-masing)  │   │
│  │ 📖 QS. An-Nisa: 11              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       📄 Download PDF           │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## API Endpoints (Ta'lim Specific)

```
# AI Chat
POST   /api/talim/chat                   # Ask AI
GET    /api/talim/chat/history           # Chat history

# Waris Calculator
POST   /api/talim/waris/calculate        # Calculate inheritance
GET    /api/talim/waris/history          # Past calculations

# Zakat Calculator
POST   /api/talim/zakat/calculate        # Calculate zakat
GET    /api/talim/zakat/history          # Past calculations

# Courses
GET    /api/talim/courses                # List courses
GET    /api/talim/courses/:id            # Course detail
POST   /api/talim/courses/:id/enroll     # Enroll course
GET    /api/talim/courses/:id/progress   # Get progress
POST   /api/talim/lessons/:id/complete   # Mark lesson complete
POST   /api/talim/quiz/:id/submit        # Submit quiz

# Library
GET    /api/talim/books                  # List books
GET    /api/talim/books/:id              # Book detail
GET    /api/talim/books/:id/content      # Book content
GET    /api/talim/fatwa                  # Search fatwa

# Prayer Times & Calendar
GET    /api/talim/prayer-times           # Get prayer times
GET    /api/talim/hijri-calendar         # Hijri calendar
GET    /api/talim/sunnah-fasting         # Sunnah fasting schedule

# Vision AI
POST   /api/talim/scan/translate         # Scan & translate Arabic text
```

---

## Halaqah / Kelas (Tenant Feature)

**Untuk Ustadz:**

- Buat kelas pembelajaran
- Assign materi/kurikulum
- Track progress santri
- Buat quiz custom
- Jadwal kajian

**Untuk Santri:**

- Join kelas
- Ikuti materi
- Kerjakan quiz
- Lihat nilai & progress

---

## Development Checklist

### Phase 1: Core AI Chat

- [ ] Gemini integration
- [ ] Islamic prompt engineering
- [ ] Chat UI
- [ ] Chat history
- [ ] Dalil formatting

### Phase 2: Calculators

- [ ] Waris calculator logic
- [ ] Waris UI
- [ ] Zakat calculator (all types)
- [ ] PDF export

### Phase 3: Learning Platform

- [ ] Course listing
- [ ] Course detail & enrollment
- [ ] Lesson viewer (video/text)
- [ ] Quiz system
- [ ] Progress tracking

### Phase 4: Library

- [ ] Book listing
- [ ] Book reader
- [ ] Search & filter
- [ ] Bookmarks

### Phase 5: Utilities

- [ ] Prayer times
- [ ] Hijri calendar
- [ ] Dzikir with audio
- [ ] Fasting reminders

### Phase 6: Vision AI

- [ ] Camera/gallery picker
- [ ] Arabic OCR
- [ ] Translation display
- [ ] Vocabulary helper

### Phase 7: Halaqah (Tenant)

- [ ] Class management
- [ ] Student progress view
- [ ] Custom quizzes
- [ ] Notifications
