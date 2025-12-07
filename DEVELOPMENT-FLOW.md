# Development Flow - Tahfidz.ai

## Development Principles

### Rules

1. **Backend First** - Database → API → Frontend
2. **Type Safety** - Always run `npx tsc --noEmit` before commit
3. **Test Before Push** - Verify functionality works
4. **Incremental** - Small, focused commits
5. **Documentation** - Update docs as you go

### Commands Before Every Commit

```bash
npx tsc --noEmit          # Type check
npm run lint              # Lint check
npm run build             # Build check (before push)
```

---

## Development Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Core infrastructure yang bisa dipakai semua fitur

#### 1.1 Database Setup

- [ ] Setup Prisma with Neon PostgreSQL
- [ ] Create schema for core tables (tenants, users)
- [ ] Create schema for auth tables (sessions, registration_attempts)
- [ ] Create schema for subscription tables
- [ ] Run migrations
- [ ] Seed initial data (super admin)

#### 1.2 Authentication System

- [ ] JWT token generation & validation
- [ ] Refresh token rotation
- [ ] Password hashing (bcrypt)
- [ ] Registration flow with OTP
- [ ] Login endpoint
- [ ] Logout endpoint
- [ ] Password reset flow

#### 1.3 Anti-Spam & Security

- [ ] Cloudflare Turnstile integration
- [ ] Rate limiting with Upstash Redis
- [ ] Device fingerprint validation
- [ ] IP-based registration lock
- [ ] Honeypot fields

#### 1.4 Multi-tenant Infrastructure

- [ ] Tenant resolution middleware
- [ ] Subdomain handling
- [ ] Tenant context provider
- [ ] Role-based access control (RBAC)

**Deliverable:** Users can register, login, and access tenant-specific data

---

### Phase 2: Admin & Tenant Management (Week 3-4)

**Goal:** Super admin can manage tenants, tenants can manage users

#### 2.1 Super Admin API

- [ ] CRUD Tenants (with soft delete)
- [ ] View all users
- [ ] Manage subscriptions
- [ ] Platform analytics endpoints
- [ ] Trash/restore functionality

#### 2.2 Tenant Admin API

- [ ] CRUD Users in tenant
- [ ] Bulk import users (CSV)
- [ ] Manage API keys
- [ ] Tenant settings
- [ ] Usage statistics

#### 2.3 Admin Frontend

- [ ] Super Admin dashboard
- [ ] Tenant list & management
- [ ] User overview
- [ ] Subscription management
- [ ] Trash page

#### 2.4 Tenant Frontend

- [ ] Tenant dashboard
- [ ] User management UI
- [ ] Settings page
- [ ] Billing page

**Deliverable:** Full admin panel for super admin and tenant admins

---

### Phase 3: Hafalan Core (Week 5-7)

**Goal:** Basic hafalan system working (Quran only first)

#### 3.1 Content Database

- [ ] Quran data schema & seeding
- [ ] Surah & Ayah tables
- [ ] Translation data
- [ ] Audio URLs (external)

#### 3.2 Hafalan API

- [ ] Get Quran content (surah, ayah, juz)
- [ ] Progress tracking CRUD
- [ ] Setoran submission
- [ ] Muroja'ah schedule generation

#### 3.3 AI Integration

- [ ] Gemini API service
- [ ] Audio analysis endpoint
- [ ] Response parsing & storage
- [ ] API key management (platform/tenant/user)

#### 3.4 Hafalan Frontend (User)

- [ ] Quran reader (Mushaf digital)
- [ ] Setoran recording UI
- [ ] AI feedback display
- [ ] Progress dashboard
- [ ] Muroja'ah schedule view

**Deliverable:** Users can do setoran Quran and get AI feedback

---

### Phase 4: Halaqah System (Week 8-9)

**Goal:** Musyrif can manage santri in groups

#### 4.1 Halaqah API

- [ ] CRUD Halaqah
- [ ] Member management
- [ ] Setoran review by musyrif
- [ ] Approve/reject setoran
- [ ] Group progress view

#### 4.2 Halaqah Frontend

- [ ] Halaqah list & create
- [ ] Member management UI
- [ ] Setoran review queue
- [ ] Group analytics

**Deliverable:** Complete halaqah workflow for pesantren

---

### Phase 5: Extended Hafalan (Week 10-11)

**Goal:** Add Hadits and Matan hafalan

#### 5.1 Hadits Module

- [ ] Hadits kitab schema
- [ ] Hadits content seeding (Arba'in first)
- [ ] Hadits hafalan API
- [ ] Hadits reader UI
- [ ] Hadits setoran flow

#### 5.2 Matan Module

- [ ] Matan kitab schema
- [ ] Matan content seeding (Jazariyyah first)
- [ ] Matan hafalan API
- [ ] Matan reader UI
- [ ] Matan setoran flow

**Deliverable:** Full 3-type hafalan system

---

### Phase 6: Gamification & Polish (Week 12-13)

**Goal:** Engagement features and UX polish

#### 6.1 Gamification

- [ ] Streak tracking
- [ ] Badge system
- [ ] Points/XP calculation
- [ ] Leaderboard
- [ ] Achievement notifications

#### 6.2 Notifications

- [ ] Email notifications (Resend)
- [ ] In-app notifications
- [ ] Muroja'ah reminders
- [ ] Push notifications (PWA)

#### 6.3 Analytics

- [ ] User progress analytics
- [ ] Tenant usage analytics
- [ ] AI usage tracking
- [ ] Export reports (PDF)

**Deliverable:** Polished, engaging user experience

---

### Phase 7: Payment & Billing (Week 14)

**Goal:** Subscription system working

#### 7.1 Payment Integration

- [ ] Midtrans integration
- [ ] Subscription plans
- [ ] Invoice generation
- [ ] Payment webhooks
- [ ] Upgrade/downgrade flow

#### 7.2 Billing UI

- [ ] Pricing page
- [ ] Checkout flow
- [ ] Payment history
- [ ] Invoice download

**Deliverable:** Monetization ready

---

### Phase 8: Production Ready (Week 15-16)

**Goal:** Ready for public launch

#### 8.1 Performance

- [ ] Database optimization
- [ ] API caching
- [ ] Image optimization
- [ ] Bundle size optimization

#### 8.2 Security Audit

- [ ] Penetration testing
- [ ] Dependency audit
- [ ] OWASP checklist
- [ ] Data encryption verification

#### 8.3 Monitoring

- [ ] Error tracking (Sentry)
- [ ] Logging (Axiom)
- [ ] Uptime monitoring
- [ ] Performance monitoring

#### 8.4 Documentation

- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Developer docs

**Deliverable:** Production-ready application

---

## Roadmap Timeline

```
Week 1-2   ████████░░░░░░░░ Phase 1: Foundation
Week 3-4   ░░░░░░░░████████ Phase 2: Admin & Tenant
Week 5-7   ████████████░░░░ Phase 3: Hafalan Core
Week 8-9   ░░░░░░░░████████ Phase 4: Halaqah
Week 10-11 ████████████░░░░ Phase 5: Extended Hafalan
Week 12-13 ░░░░░░░░████████ Phase 6: Gamification
Week 14    ░░░░░░░░░░░░████ Phase 7: Payment
Week 15-16 ████████████████ Phase 8: Production
```

---

## Current Status

### Phase 1 Progress

- [x] Project structure created
- [x] Landing page completed
- [x] Requirements documentation done
- [ ] Database setup - **IN PROGRESS**
- [ ] Authentication system
- [ ] Multi-tenant middleware

---

## File Structure Target

```
islamic-ai-platform/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (public)/          # Public pages
│   │   ├── (auth)/            # Auth pages
│   │   ├── (admin)/           # Super admin
│   │   ├── (tenant)/          # Tenant admin
│   │   ├── (user)/            # User portal
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── tenant/
│   │   │   ├── user/
│   │   │   ├── hafalan/
│   │   │   └── ai/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # Base components
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Form components
│   │   └── features/          # Feature components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth utilities
│   │   ├── gemini.ts          # AI service
│   │   ├── redis.ts           # Redis client
│   │   ├── email.ts           # Email service
│   │   └── utils.ts           # Utilities
│   ├── middleware/
│   │   ├── auth.ts            # Auth middleware
│   │   ├── tenant.ts          # Tenant middleware
│   │   └── rateLimit.ts       # Rate limiting
│   ├── hooks/                 # React hooks
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript types
├── public/
├── .env.example
├── .env.local
└── README.md
```

---

## Quality Gates

### Before Each PR

```bash
# Must pass all checks
npx tsc --noEmit              # No type errors
npm run lint                  # No lint errors
npm run build                 # Build succeeds
```

### Before Release

- All tests pass
- No critical/high vulnerabilities
- Performance benchmarks met
- Documentation updated
- Changelog updated
