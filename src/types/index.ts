// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  turnstileToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  turnstileToken?: string;
  deviceFingerprint?: string;
}

export interface VerifyOTPRequest {
  registrationId: string;
  otp: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    tenantId?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  tenantId?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

// Tenant Types
export interface TenantProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  plan: string;
  maxUsers: number;
  settings: Record<string, unknown>;
}

// Hafalan Types
export type HafalanType = 'quran' | 'hadits' | 'matan';

export interface HafalanReference {
  type: HafalanType;
  surahNumber?: number;
  ayahStart?: number;
  ayahEnd?: number;
  haditsKitabId?: string;
  haditsStart?: number;
  haditsEnd?: number;
  matanKitabId?: string;
  baitStart?: number;
  baitEnd?: number;
}

export interface SetoranRequest {
  hafalanType: HafalanType;
  reference: HafalanReference;
  audioBase64: string;
  halaqahId?: string;
  sendToMusyrif?: boolean;
}

export interface SetoranItemComment {
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
}

export interface SetoranError {
  position: number;
  word: string;
  expected: string;
  actual: string;
  type: 'lafadz' | 'tajweed' | 'pronunciation' | 'missing' | 'extra';
  severity: 'minor' | 'major';
  explanation: string;
}

export interface SetoranResult {
  score: number;
  grade: 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul' | 'rasib';
  canContinue: boolean;
  nextStart?: number;
  transcription: string;
  summary: string;
  feedbackAudioUrl?: string;
  itemComments: SetoranItemComment[];
  overallComment: string;
  errors: SetoranError[];
  suggestions: string[];
}

// Grade Thresholds
export const GRADE_THRESHOLDS = {
  mumtaz: 90,
  jayyid_jiddan: 80,
  jayyid: 70,
  maqbul: 60,
  rasib: 0,
} as const;

export function getGrade(score: number): SetoranResult['grade'] {
  if (score >= GRADE_THRESHOLDS.mumtaz) return 'mumtaz';
  if (score >= GRADE_THRESHOLDS.jayyid_jiddan) return 'jayyid_jiddan';
  if (score >= GRADE_THRESHOLDS.jayyid) return 'jayyid';
  if (score >= GRADE_THRESHOLDS.maqbul) return 'maqbul';
  return 'rasib';
}

export function canContinue(grade: SetoranResult['grade']): boolean {
  return ['mumtaz', 'jayyid_jiddan', 'jayyid'].includes(grade);
}
