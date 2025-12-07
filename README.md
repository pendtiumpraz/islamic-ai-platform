# Tahfidz.ai

Platform hafalan Al-Quran, Hadits, dan Matan dengan teknologi AI.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

Tahfidz.ai adalah platform multi-tenant untuk membantu santri dan pesantren dalam proses menghafal:

- **Al-Quran** - 30 Juz dengan tajweed dan audio
- **Hadits** - Arba'in, Bulughul Maram, dll
- **Matan** - Jazariyyah, Alfiyah, dll

### Key Features

- 🎤 **AI Setoran** - Rekam bacaan, AI analisis kesalahan
- 🔄 **Muroja'ah Otomatis** - Spaced repetition algorithm
- 📊 **Progress Tracking** - Dashboard untuk santri & musyrif
- 🏫 **Multi-tenant** - Setiap pesantren punya subdomain sendiri
- 💰 **Subscription** - Free tier + paid plans

## Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | Next.js 14, React 18, TypeScript |
| Styling  | Tailwind CSS                     |
| Backend  | Next.js API Routes               |
| Database | PostgreSQL (Neon)                |
| ORM      | Prisma                           |
| AI       | Google Gemini 2.0 Flash          |
| Cache    | Upstash Redis                    |
| Auth     | JWT + Refresh Token              |
| Email    | Resend                           |
| Hosting  | Vercel                           |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/islamic-ai-platform.git
cd islamic-ai-platform
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. Setup database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# AI (Gemini)
GEMINI_API_KEY="AIza..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TURNSTILE_SECRET_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (public)/       # Public pages (landing, about, etc)
│   ├── (auth)/         # Auth pages (login, register)
│   ├── (admin)/        # Super admin dashboard
│   ├── (tenant)/       # Tenant admin dashboard
│   ├── (user)/         # User portal
│   └── api/            # API routes
├── components/         # React components
├── lib/               # Utilities & services
├── middleware/        # Express-style middleware
├── hooks/             # React hooks
├── stores/            # Zustand stores
└── types/             # TypeScript types
```

## Development

### Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
npx prisma studio    # Open Prisma Studio
```

### Before Commit

Always run these before committing:

```bash
npx tsc --noEmit     # Must pass
npm run lint         # Must pass
```

## API Documentation

See [API.md](./docs/API.md) for full API documentation.

### Quick Reference

| Endpoint               | Method | Description       |
| ---------------------- | ------ | ----------------- |
| `/api/auth/register`   | POST   | Register new user |
| `/api/auth/login`      | POST   | Login             |
| `/api/auth/refresh`    | POST   | Refresh token     |
| `/api/hafalan/setoran` | POST   | Submit setoran    |
| `/api/ai/analyze`      | POST   | Analyze audio     |

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy

### Manual

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- **Email:** pendtiumpraz@gmail.com
- **WhatsApp:** 081319504441
- **Contact:** Galih

## Acknowledgments

Didukung oleh:

- Kesamben Mengaji
- Blitar Mengaji
- Yayasan Sanggrahan Tunas Mulia
- Yayasan Imam Syafii Blitar

---

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
