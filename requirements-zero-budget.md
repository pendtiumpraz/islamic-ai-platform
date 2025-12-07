# Zero Budget ($0) Stack - Islamic AI Platform

## Overview

Panduan lengkap untuk menjalankan platform dengan **modal $0** menggunakan free tier dari berbagai layanan.

---

## Tech Stack (100% Free Tier)

### Core Infrastructure

| Service             | Free Tier Limit                        | Fungsi                    |
| ------------------- | -------------------------------------- | ------------------------- |
| **Vercel**          | 100GB bandwidth/bulan, unlimited sites | Hosting Frontend + API    |
| **Neon PostgreSQL** | 512MB storage, 1 project               | Database utama            |
| **Upstash Redis**   | 10k commands/day                       | Rate limiting, cache, OTP |
| **Cloudflare**      | Unlimited                              | DNS, Turnstile (CAPTCHA)  |

### AI & API

| Service               | Free Tier Limit                        | Fungsi                 |
| --------------------- | -------------------------------------- | ---------------------- |
| **Google Gemini API** | 15 RPM, 1M tokens/menit, 1500 req/hari | AI Chat, Vision, Audio |
| **Gemini 2.0 Flash**  | Included in free tier                  | Multimodal AI          |

### Authentication & Security

| Service                  | Free Tier Limit           | Fungsi                    |
| ------------------------ | ------------------------- | ------------------------- |
| **Cloudflare Turnstile** | Unlimited                 | CAPTCHA (ganti reCAPTCHA) |
| **FingerprintJS**        | 20k identifications/month | Device fingerprint        |
| **Resend**               | 100 emails/day            | Email OTP & notifications |

### Storage & Media

| Service           | Free Tier Limit                 | Fungsi                       |
| ----------------- | ------------------------------- | ---------------------------- |
| **Cloudflare R2** | 10GB storage, 1M requests/month | File storage (audio, images) |
| **Uploadthing**   | 2GB storage                     | Alternative file upload      |

### Monitoring & Analytics

| Service              | Free Tier Limit          | Fungsi             |
| -------------------- | ------------------------ | ------------------ |
| **Vercel Analytics** | Basic analytics included | Traffic monitoring |
| **Sentry**           | 5k errors/month          | Error tracking     |
| **Axiom**            | 500MB ingest/month       | Logging            |

---

## Service Details & Setup

### 1. Vercel (Hosting)

**Free Tier:**

- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions (10s timeout)
- Edge functions
- Preview deployments
- Custom domains (unlimited)
- **Wildcard subdomain supported!**

**Setup:**

```bash
npm i -g vercel
vercel login
vercel --prod
```

**Limitations:**

- Serverless function timeout: 10s (cukup untuk kebanyakan API)
- No cron jobs (pakai external cron)

---

### 2. Neon PostgreSQL (Database)

**Free Tier:**

- 512MB storage
- 1 project
- Autoscaling (scale to zero)
- Branching for development
- Connection pooling included

**Setup:**

1. Daftar di https://neon.tech
2. Create project
3. Copy connection string

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

**Tips hemat storage:**

- Compress text fields jika perlu
- Gunakan JSONB untuk flexible data
- Set up auto-vacuum

---

### 3. Upstash Redis (Cache & Rate Limit)

**Free Tier:**

- 10,000 commands/day
- 256MB storage
- 1 database
- Global replication

**Setup:**

1. Daftar di https://upstash.com
2. Create Redis database
3. Copy REST URL & Token

```env
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"
```

**Usage Strategy (hemat commands):**

```typescript
// Batch operations untuk hemat commands
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.incr('counter');
await pipeline.exec(); // 1 command instead of 3

// Cache dengan TTL panjang
await redis.setex('user:123', 3600, JSON.stringify(user)); // 1 hour cache
```

---

### 4. Google Gemini API (AI)

**Free Tier (gemini-2.0-flash):**

- 15 requests per minute (RPM)
- 1 million tokens per minute
- 1,500 requests per day
- Multimodal (text, image, audio, video)

**Setup:**

1. Buka https://aistudio.google.com/app/apikey
2. Create API key
3. Enable Gemini API

```env
GEMINI_API_KEY="AIzaSy..."
```

**Rate Limit Strategy:**

```typescript
// Implement queue untuk handle rate limit
import { Ratelimit } from '@upstash/ratelimit';

const geminiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1m'), // 15 per minute
  prefix: 'gemini',
});

async function callGemini(prompt: string) {
  const { success, remaining } = await geminiLimiter.limit('global');

  if (!success) {
    throw new Error('Rate limit exceeded. Please wait.');
  }

  return await model.generateContent(prompt);
}
```

---

### 5. Cloudflare (DNS + CAPTCHA + Storage)

**Free Tier:**

- DNS management
- DDoS protection
- Turnstile CAPTCHA (unlimited)
- R2 Storage (10GB)
- Workers (100k requests/day)

**Turnstile Setup:**

1. Dashboard Cloudflare > Turnstile
2. Add site
3. Copy Site Key & Secret Key

```env
TURNSTILE_SITE_KEY="0x..."
TURNSTILE_SECRET_KEY="0x..."
```

**R2 Storage Setup:**

1. Dashboard > R2
2. Create bucket
3. Generate API token

```env
R2_ACCOUNT_ID="xxx"
R2_ACCESS_KEY_ID="xxx"
R2_SECRET_ACCESS_KEY="xxx"
R2_BUCKET_NAME="islamic-app"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

---

### 6. Resend (Email)

**Free Tier:**

- 100 emails/day
- 1 domain
- Email API

**Setup:**

1. Daftar di https://resend.com
2. Add & verify domain
3. Create API key

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@islamicapp.id"
```

**Hemat Quota Email:**

- Prioritaskan OTP dan critical notifications
- Gunakan in-app notifications untuk non-critical
- Batch digest emails (1x per hari untuk summary)

---

### 7. FingerprintJS (Device ID)

**Free Tier:**

- 20,000 identifications/month
- Basic fingerprinting
- 99.5% accuracy

**Setup:**

```bash
npm install @fingerprintjs/fingerprintjs
```

```typescript
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fp = await FingerprintJS.load();
const result = await fp.get();
const visitorId = result.visitorId; // unique device ID
```

---

## Budget Breakdown

### Monthly Limits (Free Tier)

| Resource         | Limit      | Estimasi Usage            |
| ---------------- | ---------- | ------------------------- |
| Vercel Bandwidth | 100GB      | ~50GB (low traffic)       |
| Neon Storage     | 512MB      | ~200MB (awal)             |
| Upstash Commands | 300k/month | ~100k (dengan optimisasi) |
| Gemini Requests  | 45k/month  | ~20k (dengan caching)     |
| Resend Emails    | 3k/month   | ~1k (OTP only)            |
| FingerprintJS    | 20k/month  | ~5k (new registrations)   |
| R2 Storage       | 10GB       | ~2GB (audio/images)       |

### Kapan Perlu Upgrade?

| Metric      | Free Limit   | Upgrade When          |
| ----------- | ------------ | --------------------- |
| Users       | ~500-1000    | >1000 active users    |
| AI Requests | 1500/day     | >1000 daily AI calls  |
| Storage     | 512MB + 10GB | >10GB total data      |
| Emails      | 100/day      | >50 registrations/day |

---

## Alternatif SMS OTP (Gratis)

Karena SMS berbayar, gunakan alternatif:

### Option 1: WhatsApp OTP via Fonnte (Murah)

```typescript
// Fonnte WA API - Rp 50/pesan (lebih murah dari SMS)
async function sendWhatsAppOTP(phone: string, otp: string) {
  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: process.env.FONNTE_TOKEN },
    body: JSON.stringify({
      target: phone,
      message: `[IslamicApp] Kode OTP: ${otp}\nBerlaku 5 menit.`,
    }),
  });
}
```

### Option 2: Email Only (100% Gratis)

```typescript
// Wajibkan email untuk registrasi free tier
// SMS hanya untuk paid tenant
const verificationMethod = tenant.plan === 'free' ? 'email' : 'sms';
```

### Option 3: Magic Link (Gratis)

```typescript
// Kirim link login via email instead of OTP
const magicLink = `${APP_URL}/auth/verify?token=${generateToken(email)}`;
await sendEmail(email, 'Login Link', `Click here: ${magicLink}`);
```

---

## Optimisasi untuk Free Tier

### 1. Caching Strategy (Hemat Gemini & DB)

```typescript
// Cache AI responses
async function getAIResponse(question: string) {
  const cacheKey = `ai:${hashString(question)}`;

  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Call Gemini if not cached
  const response = await callGemini(question);

  // Cache for 24 hours
  await redis.setex(cacheKey, 86400, JSON.stringify(response));

  return response;
}
```

### 2. Database Query Optimization

```typescript
// Use connection pooling (Neon provides this)
// Batch queries
const [users, stats, recent] = await Promise.all([
  db.users.findMany({ where: { tenantId } }),
  db.stats.findFirst({ where: { tenantId } }),
  db.activity.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
]);
```

### 3. Lazy Loading & Pagination

```typescript
// Always paginate
app.get('/users', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 50);

  const users = await db.users.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  return c.json({ users, page, limit });
});
```

### 4. Static Asset Optimization

```typescript
// vercel.json - cache static assets
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 5. Rate Limit per Tier

```typescript
const RATE_LIMITS = {
  free: {
    aiRequests: 10, // per user per day
    registration: 3, // per IP per day
    otp: 5, // per phone/email per hour
  },
  paid: {
    aiRequests: 100,
    registration: 10,
    otp: 10,
  },
};
```

---

## Environment Variables (.env.example)

```env
# Database (Neon)
DATABASE_URL="postgresql://..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# AI (Google Gemini)
GEMINI_API_KEY="AIzaSy..."

# Auth
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_REFRESH_SECRET="another-super-secret-key"

# Cloudflare
TURNSTILE_SITE_KEY="0x..."
TURNSTILE_SECRET_KEY="0x..."

# Storage (Cloudflare R2)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="islamic-app"

# Email (Resend)
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="https://islamicapp.id"
NODE_ENV="production"
```

---

## Checklist Setup ($0 Budget)

### Week 1: Foundation

- [ ] Setup Vercel account & project
- [ ] Setup Neon PostgreSQL
- [ ] Setup Upstash Redis
- [ ] Setup Cloudflare (DNS + Turnstile)
- [ ] Get Gemini API key
- [ ] Setup Resend for email

### Week 2: Core Features

- [ ] Auth system (email OTP only)
- [ ] Multi-tenant setup
- [ ] Basic admin dashboard
- [ ] Rate limiting

### Week 3: AI Features

- [ ] Gemini integration with caching
- [ ] Basic chat feature
- [ ] Usage tracking

### Week 4: Polish

- [ ] Error handling
- [ ] Monitoring (Sentry free)
- [ ] Basic analytics

---

## Scaling Path (When Revenue Comes)

| Stage            | Monthly Cost | Capacity       |
| ---------------- | ------------ | -------------- |
| **$0 (Current)** | $0           | 500-1000 users |
| **Starter**      | $20-50       | 5000 users     |
| **Growth**       | $100-200     | 20000 users    |
| **Scale**        | $500+        | 100000+ users  |

### First Paid Upgrades (Priority Order):

1. **Neon Pro** ($19/mo) - More storage
2. **Upstash Pro** ($10/mo) - More commands
3. **Vercel Pro** ($20/mo) - Better limits
4. **Gemini Pay-as-you-go** - More AI requests

---

## Summary: $0 Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    $0 BUDGET STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend & API:     Vercel (free)                         │
│  Database:           Neon PostgreSQL (free 512MB)          │
│  Cache/Queue:        Upstash Redis (free 10k/day)          │
│  AI:                 Google Gemini 2.0 (free 1500/day)     │
│  CAPTCHA:            Cloudflare Turnstile (free unlimited) │
│  Storage:            Cloudflare R2 (free 10GB)             │
│  Email:              Resend (free 100/day)                 │
│  Device ID:          FingerprintJS (free 20k/month)        │
│  Monitoring:         Sentry (free 5k errors)               │
│                                                             │
│  Total Monthly Cost: $0                                    │
│  Estimated Capacity: 500-1000 active users                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
