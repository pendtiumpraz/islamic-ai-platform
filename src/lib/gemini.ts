import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SetoranResult, HafalanType, SetoranItemComment, SetoranError } from '@/types';
import { getGrade, canContinue } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'dummy-key');

// Use stable model
const GEMINI_MODEL = 'gemini-1.5-flash';

const SETORAN_SYSTEM_PROMPT = `Anda adalah seorang ahli hafalan Al-Quran, Hadits, dan Matan yang berpengalaman. 
Tugas Anda adalah mengevaluasi bacaan/hafalan santri dengan detail dan konstruktif.

Evaluasi dengan kriteria:
1. Kelancaran (fluency) - Apakah bacaan lancar tanpa terbata-bata
2. Ketepatan Lafadz - Apakah kata-kata yang dibaca sesuai dengan teks asli
3. Tajweed (untuk Quran) - Apakah hukum bacaan diterapkan dengan benar
4. Makhraj - Apakah pengucapan huruf benar
5. Harakat - Apakah harakat/tanda baca diucapkan dengan tepat

Berikan feedback dalam Bahasa Indonesia yang sopan dan memotivasi.`;

export interface AnalyzeSetoranParams {
  hafalanType: HafalanType;
  expectedText: string;
  transcription: string;
  audioBase64?: string;
  referenceInfo: {
    name: string;
    start: number;
    end: number;
  };
}

export async function analyzeSetoran(params: AnalyzeSetoranParams): Promise<SetoranResult> {
  const { hafalanType, expectedText, transcription, referenceInfo } = params;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Hubungi admin.');
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const typeLabel = {
    quran: 'Al-Quran',
    hadits: 'Hadits',
    matan: 'Matan',
  }[hafalanType];

  const prompt = `${SETORAN_SYSTEM_PROMPT}

Jenis Hafalan: ${typeLabel}
Referensi: ${referenceInfo.name} (${referenceInfo.start} - ${referenceInfo.end})

TEKS YANG SEHARUSNYA DIBACA:
${expectedText}

TRANSKRIP BACAAN SANTRI:
${transcription}

Berikan analisis dalam format JSON berikut:
{
  "score": <angka 0-100>,
  "summary": "<ringkasan evaluasi dalam 2-3 kalimat>",
  "overallComment": "<komentar keseluruhan yang memotivasi>",
  "itemComments": [
    {
      "number": <nomor ayat/hadits/bait>,
      "status": "<correct|minor_error|major_error|skipped>",
      "textExpected": "<teks yang seharusnya>",
      "textRead": "<teks yang dibaca>",
      "comment": "<komentar spesifik>",
      "errors": [
        {
          "word": "<kata yang salah>",
          "readAs": "<yang dibaca>",
          "type": "<harakat|huruf|tajweed|missing|extra>",
          "explanation": "<penjelasan kesalahan>"
        }
      ]
    }
  ],
  "errors": [
    {
      "position": <posisi dalam teks>,
      "word": "<kata>",
      "expected": "<yang benar>",
      "actual": "<yang dibaca>",
      "type": "<lafadz|tajweed|pronunciation|missing|extra>",
      "severity": "<minor|major>",
      "explanation": "<penjelasan>"
    }
  ],
  "suggestions": ["<saran perbaikan 1>", "<saran 2>", ...]
}

PENTING:
- Untuk minor_error: kesalahan harakat kecil, tajweed minor
- Untuk major_error: kesalahan lafadz, skip kata, salah ayat
- Score >= 70 artinya santri bisa LANJUT ke hafalan berikutnya
- Score < 70 artinya santri perlu MENGULANG bagian ini`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    const score = Math.min(100, Math.max(0, analysis.score || 0));
    const grade = getGrade(score);

    return {
      score,
      grade,
      canContinue: canContinue(grade),
      nextStart: canContinue(grade) ? referenceInfo.end + 1 : undefined,
      transcription,
      summary: analysis.summary || '',
      itemComments: (analysis.itemComments || []) as SetoranItemComment[],
      overallComment: analysis.overallComment || '',
      errors: (analysis.errors || []) as SetoranError[],
      suggestions: analysis.suggestions || [],
    };
  } catch (error) {
    console.error('AI analysis error:', error);

    // Return default result on error
    return {
      score: 0,
      grade: 'rasib',
      canContinue: false,
      transcription,
      summary: 'Terjadi kesalahan saat menganalisis bacaan. Silakan coba lagi.',
      itemComments: [],
      overallComment: 'Sistem tidak dapat memproses bacaan Anda saat ini.',
      errors: [],
      suggestions: ['Silakan coba lagi atau hubungi admin jika masalah berlanjut.'],
    };
  }
}

// Transcribe audio using Gemini's multimodal capability
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string = 'audio/wav'
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Hubungi admin.');
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Transkripsikan audio bacaan Al-Quran/Hadits/Matan berikut ke dalam teks Arab.
Tulis persis seperti yang didengar, termasuk jika ada kesalahan atau pengulangan.
Jangan koreksi atau tambahkan apapun yang tidak diucapkan.
Hanya berikan teks transkrip tanpa penjelasan tambahan.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
    ]);

    return result.response.text().trim();
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Gagal mentranskripsikan audio');
  }
}

// AI Ustadz - General Islamic Q&A
export async function askAIUstadz(question: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi. Hubungi admin.');
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `Anda adalah seorang ustadz/ustadzah yang berpengetahuan luas tentang Islam.
Jawab pertanyaan berikut dengan bijaksana, berdasarkan Al-Quran, Hadits, dan pendapat ulama.
Jika tidak yakin atau di luar kompetensi, sampaikan dengan jujur.
Gunakan Bahasa Indonesia yang mudah dipahami.

Pertanyaan: ${question}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Ustadz error:', error);
    throw new Error('Gagal memproses pertanyaan');
  }
}
