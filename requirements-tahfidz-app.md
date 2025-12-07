# Tahfidz App Requirements - Islamic AI Platform

## Overview

Aplikasi mobile & web untuk membantu hafalan dengan bantuan AI. Mendukung **3 jenis hafalan**:

1. **Hafalan Al-Quran** - 30 Juz
2. **Hafalan Hadits** - Arba'in, Bulughul Maram, dll
3. **Hafalan Matan** - Jazariyyah, Alfiyah, Ajrumiyyah, dll

Fokus pada **muroja'ah**, **setoran**, dan **tracking progress** hafalan santri.

---

## App Identity

| Item        | Value                                   |
| ----------- | --------------------------------------- |
| Nama        | **Tahfidz.ai** atau **Hifdz**           |
| Tagline     | "Hafal Quran, Hadits & Matan dengan AI" |
| Target User | Santri, Pelajar, Tholibul Ilmi, Umum    |

---

## 3 Jenis Hafalan

### A. Hafalan Al-Quran

- 30 Juz, 114 Surah, 6236 Ayat
- Tajweed color-coded
- Audio murottal berbagai qari
- Setoran per halaman/surah

### B. Hafalan Hadits

| Kitab                       | Jumlah Hadits | Level    |
| --------------------------- | ------------- | -------- |
| Arba'in Nawawi              | 42            | Pemula   |
| Umdatul Ahkam               | 420           | Menengah |
| Bulughul Maram              | 1596          | Lanjutan |
| Riyadhus Shalihin           | 1900          | Lanjutan |
| Shahih Bukhari (Mukhtashar) | 2000+         | Advanced |

**Fitur Khusus Hadits:**

- Teks Arab + Terjemahan
- Takhrij (sumber & derajat hadits)
- Penjelasan singkat (syarah)
- Kategorisasi per bab/tema

### C. Hafalan Matan

| Matan                       | Bidang        | Jumlah Bait/Bagian |
| --------------------------- | ------------- | ------------------ |
| **Tajwid**                  |               |                    |
| Tuhfatul Athfal             | Tajwid        | 61 bait            |
| Al-Jazariyyah               | Tajwid        | 107 bait           |
| **Nahwu (Grammar)**         |               |                    |
| Al-Ajrumiyyah               | Nahwu         | ~100 baris         |
| Alfiyah Ibnu Malik          | Nahwu         | 1002 bait          |
| Mulhatul I'rab              | Nahwu         | 127 bait           |
| **Shorof (Morphology)**     |               |                    |
| Nazham Maqshud              | Shorof        | 120 bait           |
| Lamiyatul Af'al             | Shorof        | 117 bait           |
| **Fiqih**                   |               |                    |
| Matan Abi Syuja'            | Fiqih Syafi'i | ~250 baris         |
| Matan Zubad                 | Fiqih Syafi'i | 1070 bait          |
| Manzhumah Qawa'id Fiqhiyyah | Ushul Fiqih   | 140 bait           |
| **Aqidah**                  |               |                    |
| Ushul Tsalatsah             | Aqidah        | Prosa              |
| Qawa'id Arba'               | Aqidah        | Prosa              |
| Nawaqidhul Islam            | Aqidah        | 10 pembatal        |
| Lum'atul I'tiqad            | Aqidah        | Prosa              |
| **Musthalah Hadits**        |               |                    |
| Manzhumah Baiquniyyah       | Musthalah     | 34 bait            |
| **Faraidh (Waris)**         |               |                    |
| Matan Rahbiyyah             | Faraidh       | 175 bait           |
| **Lainnya**                 |               |                    |
| Asmaul Husna                | Dzikir        | 99 nama            |
| Doa Harian                  | Dzikir        | 40+ doa            |

**Fitur Khusus Matan:**

- Teks Arab dengan harakat lengkap
- Terjemahan per bait
- Audio (jika tersedia)
- Syarah/penjelasan
- Nazham mode (untuk yang bersyair)

---

## Tech Stack (Mobile)

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Framework  | React Native / Expo             |
| Language   | TypeScript                      |
| State      | Zustand + TanStack Query        |
| Navigation | Expo Router                     |
| Audio      | expo-av                         |
| Storage    | AsyncStorage + SQLite (offline) |
| AI         | Gemini 2.0 Flash API            |

---

## Core Features

### 1. Mushaf Digital

**Fitur:**

- Al-Quran lengkap 30 juz, 114 surah
- Tampilan per halaman (Madina Mushaf style)
- Tampilan per ayat dengan terjemahan
- Tajweed color-coded (warna per hukum tajwid)
- Bookmark & highlight ayat
- Night mode

**Data Source:**

- Quran text: API Quran.com atau lokal database
- Audio: Murottal dari qari terkenal (Mishary, Sudais, dll)
- Terjemahan: Kemenag RI

```typescript
interface Ayah {
  id: number;
  surah_number: number;
  ayah_number: number;
  text_uthmani: string;
  text_simple: string;
  translation_id: string;
  audio_url: string;
  page_number: number;
  juz_number: number;
  hizb_number: number;
}
```

---

### 2. Setoran Hafalan (AI Tahfidz)

**Workflow:**

```
┌─────────────────────────────────────────────────────────────┐
│                    SETORAN WORKFLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Pilih Surah/Ayat yang akan disetorkan                   │
│                          ▼                                  │
│  2. Tekan tombol "Mulai Setoran"                            │
│                          ▼                                  │
│  3. Baca hafalan (Voice Recording)                          │
│                          ▼                                  │
│  4. AI Analyze:                                             │
│     - Speech-to-text (transcribe bacaan)                    │
│     - Compare dengan text asli                              │
│     - Detect kesalahan (lafadz, tajwid, kelancaran)         │
│                          ▼                                  │
│  5. Hasil Setoran:                                          │
│     - Score (0-100)                                         │
│     - Detail kesalahan per ayat                             │
│     - Saran perbaikan                                       │
│     - Lulus / Perlu mengulang                               │
│                          ▼                                  │
│  6. Simpan ke progress & kirim ke Ustadz (jika perlu)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**AI Analysis dengan Gemini:**

**NOTE:** Audio MP3 user TIDAK disimpan ke storage. Setelah AI selesai analisis, yang disimpan hanya hasil analisisnya (text + optional TTS audio feedback dari AI).

```typescript
// services/tahfidzAI.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Unified function untuk analyze semua jenis hafalan
async function analyzeSetoran(
  audioBase64: string,
  hafalanType: 'quran' | 'hadits' | 'matan',
  expectedItems: {
    number: number;
    text: string;
  }[],
  metadata: {
    name: string; // "Al-Mulk" / "Arba'in Nawawi" / "Al-Jazariyyah"
    range: string; // "Ayat 1-10" / "Hadits 1-5" / "Bait 1-10"
  }
): Promise<SetoranResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const itemLabel = hafalanType === 'quran' ? 'ayat' : hafalanType === 'hadits' ? 'hadits' : 'bait';

  const prompt = `
Anda adalah seorang penguji hafalan ${hafalanType === 'quran' ? 'Al-Quran yang ahli dalam tajwid' : hafalanType === 'hadits' ? 'Hadits' : 'Matan ilmu Islam'}.

TUGAS:
1. Transkripsikan audio bacaan berikut
2. Bandingkan dengan teks yang seharusnya PER ${itemLabel.toUpperCase()}
3. Identifikasi kesalahan pada setiap ${itemLabel}
4. Berikan komentar konstruktif per ${itemLabel}
5. Tentukan apakah boleh LANJUT ke ${itemLabel} berikutnya atau harus ULANG

INFORMASI:
- Jenis: ${hafalanType.toUpperCase()}
- Nama: ${metadata.name}
- Range: ${metadata.range}

TEKS YANG SEHARUSNYA:
${expectedItems.map((item) => `${itemLabel} ${item.number}: ${item.text}`).join('\n\n')}

GRADING SCALE:
- 90-100: Mumtaz (Excellent) - LANJUT
- 80-89: Jayyid Jiddan (Very Good) - LANJUT
- 70-79: Jayyid (Good) - LANJUT dengan catatan
- 60-69: Maqbul (Acceptable) - ULANG bagian yang salah
- 0-59: Rasib (Failed) - ULANG semua

FORMAT OUTPUT (JSON):
{
  "score": number,
  "grade": "mumtaz" | "jayyid_jiddan" | "jayyid" | "maqbul" | "rasib",
  "canContinue": boolean,
  "nextStart": number | null,
  "transcription": "transkripsi lengkap bacaan user",
  "summary": "Ringkasan dalam 1-2 kalimat",
  "itemComments": [
    {
      "number": 1,
      "status": "correct" | "minor_error" | "major_error" | "skipped",
      "textExpected": "teks seharusnya",
      "textRead": "teks yang dibaca",
      "comment": "Komentar untuk ${itemLabel} ini",
      "tajweedNotes": ["catatan tajwid jika ada"],
      "errors": [
        {
          "word": "kata yang salah",
          "readAs": "yang dibaca",
          "type": "harakat" | "huruf" | "tajweed" | "missing" | "extra",
          "explanation": "penjelasan singkat"
        }
      ]
    }
  ],
  "overallComment": "Komentar keseluruhan yang membangun",
  "errors": [
    {
      "position": number,
      "word": "kata",
      "expected": "seharusnya",
      "actual": "yang dibaca",
      "type": "lafadz" | "tajweed" | "pronunciation" | "missing" | "extra",
      "severity": "minor" | "major",
      "explanation": "penjelasan"
    }
  ],
  "suggestions": ["saran perbaikan 1", "saran 2", "saran 3"]
}
`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
  ]);

  const analysis = JSON.parse(result.response.text());

  // Optional: Generate TTS audio feedback (jika diinginkan)
  // const feedbackAudio = await generateTTSFeedback(analysis.summary);
  // analysis.feedbackAudioUrl = feedbackAudio.url;

  return analysis;
}

// Helper: Simpan hasil ke database (tanpa audio user)
async function saveSetoranResult(
  userId: string,
  hafalanType: 'quran' | 'hadits' | 'matan',
  reference: HafalanReference,
  result: SetoranResult
) {
  return await db.setoran.create({
    data: {
      user_id: userId,
      hafalan_type: hafalanType,

      // Reference (sesuai type)
      ...(hafalanType === 'quran' && {
        surah_number: reference.surahNumber,
        ayah_start: reference.ayahStart,
        ayah_end: reference.ayahEnd,
      }),
      ...(hafalanType === 'hadits' && {
        hadits_kitab_id: reference.haditsKitabId,
        hadits_start: reference.haditsStart,
        hadits_end: reference.haditsEnd,
      }),
      ...(hafalanType === 'matan' && {
        matan_kitab_id: reference.matanKitabId,
        bait_start: reference.baitStart,
        bait_end: reference.baitEnd,
      }),

      // AI Results (yang disimpan)
      ai_score: result.score,
      ai_grade: result.grade,
      ai_transcription: result.transcription,
      ai_summary: result.summary,
      ai_feedback_audio_url: result.feedbackAudioUrl,
      ai_item_comments: result.itemComments,
      ai_errors: result.errors,
      ai_suggestions: result.suggestions,
      can_continue: result.canContinue,
      next_start: result.nextStart,
    },
  });
}
```

### Setoran Flow (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│                    SETORAN FLOW (No Audio Storage)          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User pilih ayat/hadits/bait                             │
│                          ▼                                  │
│  2. User rekam bacaan (audio di memory, tidak di-upload)    │
│                          ▼                                  │
│  3. Audio dikirim ke Gemini API untuk analisis              │
│     (stream langsung, tidak disimpan)                       │
│                          ▼                                  │
│  4. Gemini response:                                        │
│     - Transkripsi                                          │
│     - Score & Grade                                        │
│     - Komentar per ayat/hadits/bait                        │
│     - Saran perbaikan                                      │
│                          ▼                                  │
│  5. SIMPAN ke database:                                     │
│     ✓ AI analysis results (JSON)                           │
│     ✓ Score, grade, comments                               │
│     ✓ can_continue flag                                    │
│     ✗ Audio MP3 user (TIDAK disimpan)                      │
│                          ▼                                  │
│  6. Tampilkan hasil ke user:                               │
│     - Score dengan grade (Mumtaz, Jayyid, dll)             │
│     - Komentar per item                                    │
│     - Errors highlighted                                   │
│     - Button: "Lanjut" atau "Ulang"                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Muroja'ah (Review Hafalan)

**Fitur:**

- Jadwal muroja'ah otomatis (spaced repetition)
- Reminder harian
- Mode quiz (ayat acak, sambung ayat)
- Audio playback untuk self-check

**Spaced Repetition Algorithm:**

```typescript
// Simplified SM-2 algorithm for Quran memorization
interface HafalanItem {
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  easeFactor: number; // 1.3 - 2.5
  interval: number; // days
  repetitions: number;
  nextReview: Date;
  lastScore: number;
}

function calculateNextReview(item: HafalanItem, score: number): HafalanItem {
  // score: 0-100, convert to 0-5 scale
  const quality = Math.round((score / 100) * 5);

  let { easeFactor, interval, repetitions } = item;

  if (quality < 3) {
    // Failed - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  // Update ease factor
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  return {
    ...item,
    easeFactor,
    interval,
    repetitions,
    nextReview: addDays(new Date(), interval),
    lastScore: score,
  };
}
```

**Quiz Modes:**

| Mode           | Description                                    |
| -------------- | ---------------------------------------------- |
| Sambung Ayat   | Tampilkan ayat, user lanjutkan ayat berikutnya |
| Awal Surah     | Sebutkan ayat pertama dari surah X             |
| Akhir Surah    | Sebutkan ayat terakhir dari surah X            |
| Random Ayat    | Identifikasi surah & nomor ayat                |
| Fill the Blank | Lengkapi kata yang hilang                      |

---

### 4. Progress Tracking

**Dashboard Santri:**

```
┌─────────────────────────────────────────────────────────────┐
│                   PROGRESS HAFALAN                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Total Hafalan: 5 Juz (150 halaman)                        │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  16.7%          │
│                                                             │
│  Juz Terakhir: Juz 30 ✓ | Juz 29 (75%)                     │
│                                                             │
│  Streak: 🔥 15 hari berturut-turut                         │
│                                                             │
│  Hari Ini:                                                  │
│  ├─ Setoran baru: Al-Mulk 1-10 ✓                           │
│  ├─ Muroja'ah: An-Naba (98%)                               │
│  └─ Target: 1 halaman lagi                                 │
│                                                             │
│  Jadwal Muroja'ah Hari Ini:                                │
│  ├─ An-Nazi'at (overdue 2 hari)                            │
│  ├─ 'Abasa                                                  │
│  └─ At-Takwir                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Metrics Tracked:**

```typescript
interface StudentProgress {
  userId: string;

  // Overall
  totalAyahMemorized: number;
  totalPagesMemorized: number;
  totalJuzMemorized: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;

  // By Surah
  surahProgress: {
    surahNumber: number;
    ayahMemorized: number;
    totalAyah: number;
    lastSetoran: Date;
    averageScore: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  }[];

  // Daily stats
  dailyStats: {
    date: Date;
    newAyahMemorized: number;
    murojaahCompleted: number;
    averageScore: number;
    timeSpentMinutes: number;
  }[];
}
```

---

### 5. Halaqah / Kelas (Tenant Feature)

**Untuk Ustadz/Musyrif:**

- Buat kelas/halaqah tahfidz
- Tambah santri ke kelas
- Set target hafalan per santri
- Review setoran santri
- Approve/reject setoran
- Lihat progress semua santri

**Workflow Setoran ke Ustadz:**

```
Santri                          Ustadz
   │                               │
   │  1. Setoran via AI            │
   │  (score >= 80)                │
   │                               │
   │  2. Kirim untuk review ──────►│
   │                               │
   │                     3. Review │
   │                        bacaan │
   │                               │
   │◄────── 4. Approve/Reject ─────│
   │        + Catatan              │
   │                               │
   │  5. Update progress           │
   │     (jika approved)           │
   │                               │
```

**Database Schema:**

```sql
-- =====================================================
-- CONTENT TABLES (Quran, Hadits, Matan)
-- =====================================================

-- Quran Data (bisa di-seed atau pakai API external)
CREATE TABLE quran_ayah (
  id SERIAL PRIMARY KEY,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  text_uthmani TEXT NOT NULL,
  text_simple TEXT,
  translation_id TEXT,
  audio_url TEXT,
  page_number INTEGER,
  juz_number INTEGER,
  UNIQUE(surah_number, ayah_number)
);

-- Hadits Collections
CREATE TABLE hadits_kitab (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- 'arbain', 'bulughul_maram', etc
  name_ar VARCHAR(255),
  name_id VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  total_hadits INTEGER,
  level VARCHAR(50), -- pemula, menengah, lanjutan
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE hadits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitab_id UUID REFERENCES hadits_kitab(id),
  hadits_number INTEGER NOT NULL,
  bab_number INTEGER,
  bab_name VARCHAR(255),

  -- Content
  text_ar TEXT NOT NULL,
  text_id TEXT, -- terjemahan

  -- Takhrij
  rawi VARCHAR(255),
  takhrij TEXT, -- sumber asli (Bukhari, Muslim, dll)
  derajat VARCHAR(50), -- shahih, hasan, dhaif

  -- Syarah
  syarah_brief TEXT,
  fawaid JSONB, -- array of lessons/benefits

  audio_url TEXT,

  UNIQUE(kitab_id, hadits_number)
);

-- Matan Collections
CREATE TABLE matan_kitab (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- 'jazariyyah', 'alfiyah', etc
  name_ar VARCHAR(255),
  name_id VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  category VARCHAR(100), -- tajwid, nahwu, shorof, fiqih, aqidah, etc
  total_bait INTEGER,
  is_nazham BOOLEAN DEFAULT true, -- syair atau prosa
  level VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE matan_bait (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitab_id UUID REFERENCES matan_kitab(id),
  bait_number INTEGER NOT NULL,
  bab_number INTEGER,
  bab_name VARCHAR(255),

  -- Content
  text_ar TEXT NOT NULL,
  text_id TEXT, -- terjemahan
  syarah TEXT, -- penjelasan

  audio_url TEXT,

  UNIQUE(kitab_id, bait_number)
);

-- =====================================================
-- HAFALAN SYSTEM (Support 3 Types)
-- =====================================================

-- Halaqah / Study Groups
CREATE TABLE halaqah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'quran', -- quran, hadits, matan, mixed
  musyrif_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Halaqah Members
CREATE TABLE halaqah_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  halaqah_id UUID REFERENCES halaqah(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'santri', -- musyrif, santri
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(halaqah_id, user_id)
);

-- Unified Hafalan Progress (All 3 Types)
CREATE TABLE hafalan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),

  -- Type & Reference
  hafalan_type VARCHAR(20) NOT NULL, -- 'quran', 'hadits', 'matan'

  -- For Quran
  surah_number INTEGER,
  ayah_start INTEGER,
  ayah_end INTEGER,

  -- For Hadits
  hadits_kitab_id UUID REFERENCES hadits_kitab(id),
  hadits_start INTEGER,
  hadits_end INTEGER,

  -- For Matan
  matan_kitab_id UUID REFERENCES matan_kitab(id),
  bait_start INTEGER,
  bait_end INTEGER,

  -- Progress
  status VARCHAR(50) DEFAULT 'memorizing', -- memorizing, reviewing, mastered
  memorized_at TIMESTAMP, -- kapan pertama kali hafal

  -- Spaced Repetition
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review DATE,
  last_review DATE,
  last_score INTEGER,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Unified Setoran Records
-- NOTE: Audio MP3 user TIDAK disimpan (hemat storage)
-- Yang disimpan: hasil analisis AI (text + audio feedback URL jika ada)
CREATE TABLE setoran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  halaqah_id UUID REFERENCES halaqah(id),

  -- Type & Reference
  hafalan_type VARCHAR(20) NOT NULL, -- 'quran', 'hadits', 'matan'

  -- For Quran
  surah_number INTEGER,
  ayah_start INTEGER,
  ayah_end INTEGER,

  -- For Hadits
  hadits_kitab_id UUID REFERENCES hadits_kitab(id),
  hadits_start INTEGER,
  hadits_end INTEGER,

  -- For Matan
  matan_kitab_id UUID REFERENCES matan_kitab(id),
  bait_start INTEGER,
  bait_end INTEGER,

  -- AI Analysis Results (STORED, bukan audio user)
  ai_score INTEGER,                    -- Nilai keseluruhan 0-100
  ai_grade VARCHAR(20),                -- mumtaz, jayyid_jiddan, jayyid, maqbul, rasib
  ai_transcription TEXT,               -- Transkripsi bacaan user
  ai_summary TEXT,                     -- Ringkasan feedback dalam 1-2 kalimat
  ai_feedback_audio_url TEXT,          -- URL audio feedback dari AI (TTS) - optional

  -- Detailed per-item comments (JSONB)
  ai_item_comments JSONB,              -- Komentar per ayat/hadits/bait (lihat struktur di bawah)
  ai_errors JSONB,                     -- List kesalahan detail
  ai_suggestions JSONB,                -- Saran perbaikan

  -- Lanjut atau Ulang?
  can_continue BOOLEAN DEFAULT false,  -- Boleh lanjut ke bagian berikutnya?
  next_start INTEGER,                  -- Nomor ayat/hadits/bait selanjutnya

  -- Ustadz Review (optional, untuk halaqah)
  musyrif_id UUID REFERENCES users(id),
  musyrif_score INTEGER,
  musyrif_notes TEXT,
  status VARCHAR(50) DEFAULT 'completed', -- completed, needs_review, reviewed
  reviewed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- AI RESPONSE JSONB STRUCTURES
-- =====================================================

/*
ai_item_comments structure:
{
  "items": [
    {
      "number": 1,                    // nomor ayat/hadits/bait
      "status": "correct",            // correct, minor_error, major_error, skipped
      "text_expected": "...",         // teks yang seharusnya
      "text_read": "...",             // teks yang dibaca user
      "comment": "Bacaan sudah benar, tajwid bagus",
      "tajweed_notes": ["Idgham sudah tepat", "Mad thabii 2 harakat"]
    },
    {
      "number": 2,
      "status": "minor_error",
      "text_expected": "...",
      "text_read": "...",
      "comment": "Ada kesalahan kecil pada kata ke-3",
      "errors": [
        {
          "word": "يَخْشَوْنَ",
          "read_as": "يَخْشَونَ",
          "type": "harakat",
          "explanation": "Kurang sukun pada waw"
        }
      ]
    }
  ],
  "overall_comment": "Secara keseluruhan bagus, perhatikan mad pada beberapa tempat"
}

ai_errors structure:
[
  {
    "position": 2,                    // nomor ayat/hadits/bait
    "word": "الرحمن",
    "expected": "الرَّحْمَٰنِ",
    "actual": "الرَحْمَنِ",
    "type": "tajweed",               // lafadz, tajweed, pronunciation, missing, extra
    "severity": "minor",             // minor, major
    "explanation": "Kurang tasydid pada huruf Ra"
  }
]

ai_suggestions structure:
[
  "Perbanyak latihan mad wajib muttashil",
  "Perhatikan ghunnah pada nun sukun sebelum ba",
  "Baca lebih pelan pada bagian akhir ayat"
]
*/

-- Unified Muroja'ah Schedule
CREATE TABLE murojaah_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),

  -- Type & Reference
  hafalan_type VARCHAR(20) NOT NULL,

  -- For Quran
  surah_number INTEGER,
  ayah_start INTEGER,
  ayah_end INTEGER,

  -- For Hadits
  hadits_kitab_id UUID REFERENCES hadits_kitab(id),
  hadits_start INTEGER,
  hadits_end INTEGER,

  -- For Matan
  matan_kitab_id UUID REFERENCES matan_kitab(id),
  bait_start INTEGER,
  bait_end INTEGER,

  -- Schedule
  scheduled_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  completed_at TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_hafalan_user ON hafalan_progress(user_id);
CREATE INDEX idx_hafalan_type ON hafalan_progress(hafalan_type);
CREATE INDEX idx_hafalan_next_review ON hafalan_progress(next_review);

CREATE INDEX idx_setoran_user ON setoran(user_id);
CREATE INDEX idx_setoran_status ON setoran(status);

CREATE INDEX idx_murojaah_user_date ON murojaah_schedule(user_id, scheduled_date);
```

### TypeScript Types

```typescript
// types/hafalan.ts

type HafalanType = 'quran' | 'hadits' | 'matan';

interface HafalanReference {
  type: HafalanType;

  // Quran
  surahNumber?: number;
  ayahStart?: number;
  ayahEnd?: number;

  // Hadits
  haditsKitabId?: string;
  haditsKitabCode?: string; // 'arbain', 'bulughul_maram'
  haditsStart?: number;
  haditsEnd?: number;

  // Matan
  matanKitabId?: string;
  matanKitabCode?: string; // 'jazariyyah', 'alfiyah'
  baitStart?: number;
  baitEnd?: number;
}

interface SetoranRequest {
  hafalanType: HafalanType;
  reference: HafalanReference;
  audioBase64: string;
  sendToMusyrif?: boolean;
}

interface SetoranResult {
  // Scores
  score: number; // 0-100
  grade: 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul' | 'rasib';
  canContinue: boolean; // Boleh lanjut ke bagian berikutnya?
  nextStart?: number; // Nomor ayat/hadits/bait selanjutnya

  // AI Analysis
  transcription: string; // Transkripsi bacaan user
  summary: string; // Ringkasan dalam 1-2 kalimat
  feedbackAudioUrl?: string; // URL audio feedback dari AI (TTS)

  // Per-item comments
  itemComments: {
    number: number;
    status: 'correct' | 'minor_error' | 'major_error' | 'skipped';
    textExpected: string;
    textRead: string;
    comment: string;
    tajweedNotes?: string[];
    errors?: {
      word: string;
      readAs: string;
      type: 'harakat' | 'huruf' | 'tajweed' | 'missing' | 'extra';
      explanation: string;
    }[];
  }[];
  overallComment: string;

  // Errors & Suggestions
  errors: {
    position: number;
    word: string;
    expected: string;
    actual: string;
    type: 'lafadz' | 'tajweed' | 'pronunciation' | 'missing' | 'extra';
    severity: 'minor' | 'major';
    explanation: string;
  }[];
  suggestions: string[];
}

// Grade calculation
const GRADE_THRESHOLDS = {
  mumtaz: 90, // Excellent - lanjut
  jayyid_jiddan: 80, // Very Good - lanjut
  jayyid: 70, // Good - lanjut dengan catatan
  maqbul: 60, // Acceptable - ulang bagian yang salah
  rasib: 0, // Failed - ulang semua
};

// Progress Summary
interface HafalanSummary {
  quran: {
    totalAyah: number;
    totalJuz: number;
    totalSurah: number;
    percentage: number;
  };
  hadits: {
    [kitabCode: string]: {
      kitabName: string;
      memorized: number;
      total: number;
      percentage: number;
    };
  };
  matan: {
    [kitabCode: string]: {
      kitabName: string;
      memorized: number;
      total: number;
      percentage: number;
    };
  };
}
```

---

### 6. Gamification

**Elements:**

| Element         | Description                            |
| --------------- | -------------------------------------- |
| **Streak**      | Hari berturut-turut setoran/muroja'ah  |
| **Badges**      | Pencapaian (1 juz, 5 juz, khatam, dll) |
| **Levels**      | Naik level berdasarkan total hafalan   |
| **Leaderboard** | Ranking dalam halaqah/global           |
| **Points**      | XP dari setiap aktivitas               |

**Badge Examples:**

```typescript
const BADGES = {
  // ========== QURAN BADGES ==========
  quran: [
    { id: 'quran_first_surah', name: 'Surah Pertama', desc: 'Hafal 1 surah lengkap', icon: '📖' },
    { id: 'quran_juz_30', name: 'Juz Amma', desc: 'Khatam Juz 30', icon: '🌟' },
    { id: 'quran_juz_29', name: 'Juz Tabarak', desc: 'Khatam Juz 29', icon: '🌟' },
    { id: 'quran_juz_5', name: '5 Juz', desc: 'Hafal 5 juz', icon: '🏅' },
    { id: 'quran_juz_10', name: '10 Juz', desc: 'Hafal 10 juz', icon: '🏆' },
    { id: 'quran_juz_15', name: '15 Juz', desc: 'Hafal 15 juz', icon: '🏆' },
    { id: 'quran_juz_20', name: '20 Juz', desc: 'Hafal 20 juz', icon: '🏆' },
    { id: 'quran_hafidz', name: 'Hafidz/Hafidzah', desc: 'Khatam 30 juz', icon: '👑' },
  ],

  // ========== HADITS BADGES ==========
  hadits: [
    { id: 'hadits_first', name: 'Hadits Pertama', desc: 'Hafal hadits pertama', icon: '📜' },
    { id: 'hadits_arbain_10', name: '10 Hadits', desc: "Hafal 10 hadits Arba'in", icon: '📜' },
    { id: 'hadits_arbain', name: "Arba'in Nawawi", desc: "Khatam 42 hadits Arba'in", icon: '🏅' },
    {
      id: 'hadits_umdah_100',
      name: '100 Hadits Ahkam',
      desc: 'Hafal 100 hadits Umdatul Ahkam',
      icon: '🏅',
    },
    { id: 'hadits_umdah', name: 'Umdatul Ahkam', desc: 'Khatam Umdatul Ahkam', icon: '🏆' },
    { id: 'hadits_bulugh', name: 'Bulughul Maram', desc: 'Khatam Bulughul Maram', icon: '👑' },
    { id: 'hadits_1000', name: '1000 Hadits', desc: 'Total 1000 hadits', icon: '👑' },
  ],

  // ========== MATAN BADGES ==========
  matan: [
    { id: 'matan_first', name: 'Bait Pertama', desc: 'Hafal bait pertama', icon: '📝' },
    {
      id: 'matan_tuhfah',
      name: 'Tuhfatul Athfal',
      desc: 'Khatam Tuhfatul Athfal (61 bait)',
      icon: '🏅',
    },
    {
      id: 'matan_jazariyyah',
      name: 'Al-Jazariyyah',
      desc: 'Khatam Al-Jazariyyah (107 bait)',
      icon: '🏅',
    },
    { id: 'matan_ajrumiyyah', name: 'Al-Ajrumiyyah', desc: 'Khatam Al-Ajrumiyyah', icon: '🏅' },
    {
      id: 'matan_baiquniyyah',
      name: 'Baiquniyyah',
      desc: 'Khatam Baiquniyyah (34 bait)',
      icon: '🏅',
    },
    {
      id: 'matan_alfiyah',
      name: 'Alfiyah',
      desc: 'Khatam Alfiyah Ibnu Malik (1002 bait)',
      icon: '👑',
    },
    {
      id: 'matan_ushul_tsalatsah',
      name: 'Ushul Tsalatsah',
      desc: 'Khatam Ushul Tsalatsah',
      icon: '🏅',
    },
    { id: 'matan_qawaid_arba', name: "Qawa'id Arba'", desc: "Khatam Qawa'id Arba'", icon: '🏅' },
  ],

  // ========== GENERAL BADGES ==========
  general: [
    { id: 'streak_7', name: 'Istiqomah', desc: '7 hari berturut-turut', icon: '🔥' },
    { id: 'streak_30', name: 'Konsisten', desc: '30 hari berturut-turut', icon: '💪' },
    { id: 'streak_100', name: 'Mujahadah', desc: '100 hari berturut-turut', icon: '🌟' },
    { id: 'streak_365', name: 'Penuntut Ilmu Sejati', desc: '365 hari berturut-turut', icon: '👑' },
    { id: 'perfect_score', name: 'Mumtaz', desc: 'Setoran dengan nilai 100', icon: '⭐' },
    { id: 'perfect_10', name: '10x Mumtaz', desc: '10 setoran nilai sempurna', icon: '⭐' },
    { id: 'early_bird', name: 'Early Bird', desc: 'Setoran sebelum Shubuh', icon: '🌅' },
    { id: 'night_owl', name: 'Qiyamul Lail', desc: 'Setoran setelah Isya', icon: '🌙' },
    { id: 'multitalent', name: 'Multitalent', desc: 'Hafal Quran + Hadits + Matan', icon: '🎯' },
  ],
};
```

---

### 7. Offline Support

**Offline Features:**

- Mushaf digital (cached)
- Audio murottal (downloaded)
- Progress tracking (synced when online)
- Setoran recording (upload when online)

**Implementation:**

```typescript
// SQLite for offline storage
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tahfidz.db');

// Cache Quran data
async function cacheQuranData() {
  // Download and store in SQLite
}

// Queue setoran for sync
async function queueSetoran(setoran: Setoran) {
  await db.runAsync('INSERT INTO pending_setoran (data, created_at) VALUES (?, ?)', [
    JSON.stringify(setoran),
    new Date().toISOString(),
  ]);
}

// Sync when online
async function syncPendingSetoran() {
  const pending = await db.getAllAsync('SELECT * FROM pending_setoran');

  for (const item of pending) {
    try {
      await api.submitSetoran(JSON.parse(item.data));
      await db.runAsync('DELETE FROM pending_setoran WHERE id = ?', [item.id]);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

---

## Screen Wireframes

### Home Screen

```
┌─────────────────────────────────────────┐
│ ☰  Tahfidz.ai                     👤    │
├─────────────────────────────────────────┤
│                                         │
│  Assalamu'alaikum, Ahmad! 👋            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔥 Streak: 15 hari             │   │
│  │  📖 Hafalan: 5 Juz              │   │
│  │  ⭐ Level: Penghafal Pemula     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📌 Jadwal Hari Ini                     │
│  ┌─────────────────────────────────┐   │
│  │ □ Setoran: Al-Mulk 11-20        │   │
│  │ □ Muroja'ah: An-Naba            │   │
│  │ ✓ Muroja'ah: An-Nazi'at         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐ ┌──────────┐            │
│  │ 📖       │ │ 🎤       │            │
│  │ Mushaf   │ │ Setoran  │            │
│  └──────────┘ └──────────┘            │
│                                         │
│  ┌──────────┐ ┌──────────┐            │
│  │ 🔄       │ │ 📊       │            │
│  │Muroja'ah │ │ Progress │            │
│  └──────────┘ └──────────┘            │
│                                         │
├─────────────────────────────────────────┤
│  🏠    📖    🎤    📊    👤            │
└─────────────────────────────────────────┘
```

### Setoran Screen

```
┌─────────────────────────────────────────┐
│ ←  Setoran Hafalan                      │
├─────────────────────────────────────────┤
│                                         │
│  Surah: Al-Mulk                         │
│  Ayat: 11 - 20                          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  إِنَّ الَّذِينَ يَخْشَوْنَ...      │   │
│  │                                 │   │
│  │  [Teks ayat yang akan           │   │
│  │   disetorkan - bisa di-hide]    │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         ⏺ 00:00                 │   │
│  │                                 │   │
│  │    [Tekan untuk merekam]        │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ Sembunyikan teks saat merekam       │
│  ☐ Kirim ke Ustadz untuk review        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Mulai Setoran           │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Result Screen

```
┌─────────────────────────────────────────┐
│ ←  Hasil Setoran                        │
├─────────────────────────────────────────┤
│                                         │
│           ┌───────────┐                 │
│           │    92     │                 │
│           │   /100    │                 │
│           │  MUMTAZ   │                 │
│           └───────────┘                 │
│                                         │
│  ✅ Setoran Diterima!                   │
│                                         │
│  📝 Detail:                             │
│  ┌─────────────────────────────────┐   │
│  │ Kesalahan:                      │   │
│  │                                 │   │
│  │ • Ayat 13: "يخشون" dibaca      │   │
│  │   "يخشوون" (tambahan waw)       │   │
│  │                                 │   │
│  │ • Ayat 15: Mad terlalu panjang  │   │
│  │   pada "السماء"                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  💡 Saran:                              │
│  Perhatikan mad ashli (2 harakat)       │
│  pada kata yang tidak ada huruf mad     │
│  setelahnya.                            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Lanjut ke Ayat Berikut     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## API Endpoints (Tahfidz Specific)

```
# Setoran
POST   /api/tahfidz/setoran              # Submit setoran (with audio)
GET    /api/tahfidz/setoran              # List user's setoran
GET    /api/tahfidz/setoran/:id          # Get setoran detail

# Muroja'ah
GET    /api/tahfidz/murojaah/schedule    # Get today's murojaah schedule
POST   /api/tahfidz/murojaah/complete    # Mark murojaah as done
GET    /api/tahfidz/murojaah/quiz        # Get quiz questions

# Progress
GET    /api/tahfidz/progress             # Get user progress
GET    /api/tahfidz/progress/stats       # Get statistics

# Halaqah (Tenant)
GET    /api/tahfidz/halaqah              # List halaqah
POST   /api/tahfidz/halaqah              # Create halaqah
GET    /api/tahfidz/halaqah/:id/members  # List members
POST   /api/tahfidz/halaqah/:id/members  # Add member
GET    /api/tahfidz/halaqah/:id/setoran  # List setoran for review

# Musyrif Actions
PUT    /api/tahfidz/setoran/:id/review   # Approve/reject setoran
```

---

## Development Checklist

### Phase 1: Core Quran Features

- [ ] Mushaf digital dengan tajweed
- [ ] Audio player murottal
- [ ] Bookmark & highlight
- [ ] Search ayat

### Phase 2: AI Setoran

- [ ] Voice recording
- [ ] Gemini integration for analysis
- [ ] Result display
- [ ] History

### Phase 3: Muroja'ah System

- [ ] Spaced repetition algorithm
- [ ] Daily schedule
- [ ] Quiz modes
- [ ] Reminders

### Phase 4: Progress & Gamification

- [ ] Progress dashboard
- [ ] Badges system
- [ ] Streak tracking
- [ ] Leaderboard

### Phase 5: Halaqah (Tenant)

- [ ] Halaqah management
- [ ] Musyrif review flow
- [ ] Santri progress view
- [ ] Notifications

### Phase 6: Offline & Polish

- [ ] Offline mode
- [ ] Data sync
- [ ] Performance optimization
- [ ] UI polish
