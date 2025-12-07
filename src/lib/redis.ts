import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters
export const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '24h'),
  prefix: 'ratelimit:register',
});

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15m'),
  prefix: 'ratelimit:login',
});

export const otpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1h'),
  prefix: 'ratelimit:otp',
});

export const aiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1m'), // Gemini free tier: 15 RPM
  prefix: 'ratelimit:ai',
});

// OTP Storage
const OTP_EXPIRY = 5 * 60; // 5 minutes

export async function storeOTP(identifier: string, otp: string): Promise<void> {
  await redis.setex(`otp:${identifier}`, OTP_EXPIRY, otp);
}

export async function verifyOTP(identifier: string, otp: string): Promise<boolean> {
  const stored = await redis.get<string>(`otp:${identifier}`);

  if (stored === otp) {
    await redis.del(`otp:${identifier}`);
    return true;
  }

  return false;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Session/Cache helpers
export async function cacheSet(key: string, value: unknown, ttl: number = 3600): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redis.get<string>(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return data as T;
  }
}

export async function cacheDelete(key: string): Promise<void> {
  await redis.del(key);
}
