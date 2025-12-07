const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  // Skip in development if no key configured
  if (!TURNSTILE_SECRET) {
    console.warn('Turnstile secret not configured, skipping verification');
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', TURNSTILE_SECRET);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const result: TurnstileResult = await response.json();
    return result.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
