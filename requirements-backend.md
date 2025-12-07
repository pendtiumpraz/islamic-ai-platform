# Backend Requirements - Islamic AI Platform

## Overview

Backend service untuk platform Islamic AI dengan arsitektur multi-tenant yang mendukung 2 aplikasi: **Tahfidz App** (hafalan) dan **Ta'lim App** (belajar ilmu syar'i).

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Runtime   | Node.js 20+ / Bun                  |
| Framework | Hono.js / Express.js               |
| Database  | PostgreSQL 15+                     |
| ORM       | Drizzle ORM / Prisma               |
| Cache     | Redis                              |
| AI        | Google Gemini 2.0 Flash API        |
| Auth      | JWT + Refresh Token                |
| Storage   | Google Cloud Storage / S3          |
| Queue     | BullMQ (Redis-based)               |
| Search    | Meilisearch / PostgreSQL Full-text |

---

## Multi-Tenant Architecture

### Subdomain & Custom Domain Support

**Deployment:** Vercel (mendukung wildcard subdomain)

```
┌─────────────────────────────────────────────────────────────┐
│                    DOMAIN STRUCTURE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Platform Admin:                                            │
│    admin.islamicapp.id                                      │
│                                                             │
│  Tenant Subdomains (auto-generated):                        │
│    {tenant-slug}.islamicapp.id                              │
│    pesantren-darussalam.islamicapp.id                       │
│    sdit-nur-hidayah.islamicapp.id                           │
│    mahad-salafi-bandung.islamicapp.id                       │
│                                                             │
│  Custom Domain (Pro/Enterprise add-on):                     │
│    belajar.pesantrenxyz.com → tenant_id: xxx                │
│    tahfidz.sekolahislam.sch.id → tenant_id: yyy             │
│                                                             │
│  Apps:                                                      │
│    tahfidz.islamicapp.id (Tahfidz App - hafalan)           │
│    talim.islamicapp.id (Ta'lim App - belajar)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tenant Resolution Middleware

```javascript
// middleware/tenant.js
async function resolveTenant(req, res, next) {
  const host = req.headers.host;

  // 1. Check custom domain first
  let tenant = await db.tenants.findFirst({
    where: { custom_domain: host, is_active: true },
  });

  // 2. Extract subdomain if not custom domain
  if (!tenant) {
    const subdomain = host.split('.')[0];

    // Skip for main domains
    if (['admin', 'api', 'www', 'tahfidz', 'talim'].includes(subdomain)) {
      return next();
    }

    tenant = await db.tenants.findFirst({
      where: { slug: subdomain, is_active: true },
    });
  }

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  req.tenant = tenant;
  next();
}
```

### Vercel Configuration

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### Domain Database Schema

```sql
-- Add to tenants table
ALTER TABLE tenants ADD COLUMN slug VARCHAR(100) UNIQUE NOT NULL;
ALTER TABLE tenants ADD COLUMN custom_domain VARCHAR(255) UNIQUE;
ALTER TABLE tenants ADD COLUMN custom_domain_verified BOOLEAN DEFAULT false;

-- Custom domains table (for multiple domains per tenant - enterprise)
CREATE TABLE tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Vercel Domain API Integration

```javascript
// services/domain.js
import { Vercel } from '@vercel/sdk';

class DomainService {
  constructor() {
    this.vercel = new Vercel({ token: process.env.VERCEL_TOKEN });
  }

  // Add custom domain for tenant
  async addCustomDomain(tenantId, domain) {
    // 1. Add domain to Vercel project
    await this.vercel.domains.add({
      projectId: process.env.VERCEL_PROJECT_ID,
      domain: domain,
    });

    // 2. Save to database
    await db.tenantDomains.create({
      data: { tenant_id: tenantId, domain, is_verified: false },
    });

    // 3. Return DNS configuration for tenant
    return {
      type: 'CNAME',
      name: domain,
      value: 'cname.vercel-dns.com',
    };
  }

  // Verify domain ownership
  async verifyDomain(tenantId, domain) {
    const verification = await this.vercel.domains.verify({ domain });

    if (verification.verified) {
      await db.tenantDomains.update({
        where: { domain },
        data: { is_verified: true, verified_at: new Date() },
      });
    }

    return verification;
  }
}
```

---

### User Roles & Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                          │
│         (Platform Owner - Full Access)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  TENANT A │  │  TENANT B │  │  TENANT C │
│ (Pesantren│  │ (Sekolah) │  │ (Lembaga) │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  USERS    │  │  USERS    │  │  USERS    │
│ (Santri)  │  │ (Siswa)   │  │ (Member)  │
└───────────┘  └───────────┘  └───────────┘
```

### Role Permissions

| Permission                  | Super Admin | Tenant Admin | User |
| --------------------------- | :---------: | :----------: | :--: |
| Manage All Tenants          |     ✅      |      ❌      |  ❌  |
| Manage Pricing & Plans      |     ✅      |      ❌      |  ❌  |
| View Platform Analytics     |     ✅      |      ❌      |  ❌  |
| Manage Own Tenant           |     ✅      |      ✅      |  ❌  |
| Manage Users (CRUD)         |     ✅      |      ✅      |  ❌  |
| Set Tenant API Key          |     ✅      |      ✅      |  ❌  |
| View Tenant Analytics       |     ✅      |      ✅      |  ❌  |
| Access Learning Features    |     ✅      |      ✅      |  ✅  |
| Use AI Features             |     ✅      |      ✅      |  ✅  |
| Set Personal API Key (BYOK) |     ❌      |      ✅      | ✅\* |

\*Only on unlimited tier

---

## API Key Management System

### Tier System

```
┌─────────────────────────────────────────────────────────┐
│                   API KEY HIERARCHY                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Priority 1: User's Own API Key (BYOK)                 │
│       ↓ (if not set)                                   │
│  Priority 2: Tenant's API Key                          │
│       ↓ (if not set / free tier)                       │
│  Priority 3: Platform Admin API Key (rate limited)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### API Key Resolution Logic

```javascript
function resolveApiKey(user, tenant) {
  // 1. Check user's own key (BYOK - unlimited tier only)
  if (tenant.plan === 'unlimited' && user.geminiApiKey) {
    return { key: user.geminiApiKey, source: 'user' };
  }

  // 2. Check tenant's key (paid tiers)
  if (tenant.geminiApiKey && tenant.plan !== 'free') {
    return { key: tenant.geminiApiKey, source: 'tenant' };
  }

  // 3. Fallback to platform key (free tier - rate limited)
  return { key: process.env.PLATFORM_GEMINI_KEY, source: 'platform' };
}
```

### Rate Limiting by Tier

| Tier                    | API Key Source | Daily AI Requests | Monthly Limit    |
| ----------------------- | -------------- | ----------------- | ---------------- |
| Free                    | Platform       | 50/user           | 1,000/tenant     |
| Starter (30 users)      | Tenant         | 200/user          | 6,000/tenant     |
| Growth (100 users)      | Tenant         | 300/user          | 30,000/tenant    |
| Pro (500 users)         | Tenant         | 500/user          | 250,000/tenant   |
| Enterprise (1000 users) | Tenant         | 1,000/user        | 1,000,000/tenant |
| Unlimited               | User (BYOK)    | Unlimited         | Unlimited        |

---

## Pricing Plans

### Tenant Subscription Plans

| Plan           | Max Users | Price (IDR/month) | Features                      |
| -------------- | --------- | ----------------- | ----------------------------- |
| **Free**       | 5         | Rp 0              | Basic features, limited AI    |
| **Starter**    | 30        | Rp 299,000        | Full features, tenant API key |
| **Growth**     | 100       | Rp 799,000        | + Analytics, priority support |
| **Pro**        | 500       | Rp 2,499,000      | + Custom branding, API access |
| **Enterprise** | 1,000     | Rp 4,999,000      | + Dedicated support, SLA      |
| **Unlimited**  | Custom    | Contact Sales     | BYOK, unlimited everything    |

### Add-ons

| Add-on                        | Price            |
| ----------------------------- | ---------------- |
| Extra 10 users                | Rp 50,000/month  |
| Extra AI quota (10k requests) | Rp 100,000/month |
| Custom domain                 | Rp 200,000/month |
| White-label branding          | Rp 500,000/month |

---

## Database Schema (Core Tables)

### Multi-tenant Tables

```sql
-- Tenants (Pesantren/Sekolah/Lembaga)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  logo_url TEXT,

  -- Subscription
  plan VARCHAR(50) DEFAULT 'free',
  max_users INTEGER DEFAULT 5,
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,

  -- API Key (encrypted)
  gemini_api_key_encrypted TEXT,

  -- Settings
  settings JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),

  -- Auth
  email VARCHAR(255),
  phone VARCHAR(20),
  password_hash VARCHAR(255),

  -- Profile
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- super_admin, tenant_admin, user

  -- BYOK (for unlimited tier)
  gemini_api_key_encrypted TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,

  -- Timestamps
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,              -- Soft delete
  deleted_by UUID REFERENCES users(id), -- Who deleted

  UNIQUE(tenant_id, email)
);

-- API Usage Tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),

  -- Usage
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  token_input INTEGER DEFAULT 0,
  token_output INTEGER DEFAULT 0,

  -- Source
  api_key_source VARCHAR(20), -- 'platform', 'tenant', 'user'

  UNIQUE(tenant_id, user_id, date)
);

-- Subscriptions & Payments
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),

  plan VARCHAR(50) NOT NULL,
  price_amount DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'IDR',

  status VARCHAR(50), -- active, cancelled, expired

  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,

  -- Payment
  payment_method VARCHAR(50),
  payment_reference TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Soft Delete Implementation

### Prinsip

Semua operasi DELETE di SuperAdmin menggunakan **soft delete** untuk:

1. **Data Recovery** - Bisa restore jika tidak sengaja dihapus
2. **Audit Trail** - Tracking siapa yang menghapus dan kapan
3. **Referential Integrity** - Tidak merusak relasi data
4. **Compliance** - Memenuhi kebutuhan audit/legal

### Tables dengan Soft Delete

| Table              | deleted_at | deleted_by | Cascade                     |
| ------------------ | ---------- | ---------- | --------------------------- |
| `tenants`          | ✅         | ✅         | Soft delete semua users     |
| `users`            | ✅         | ✅         | Soft delete semua data user |
| `halaqah`          | ✅         | ✅         | Soft delete members         |
| `hafalan_progress` | ✅         | ❌         | -                           |
| `setoran`          | ✅         | ❌         | -                           |

### Database Columns

```sql
-- Tambahkan ke semua tabel yang perlu soft delete
ALTER TABLE tenants ADD COLUMN deleted_by UUID REFERENCES users(id);
ALTER TABLE halaqah ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE halaqah ADD COLUMN deleted_by UUID REFERENCES users(id);

-- Index untuk query performance
CREATE INDEX idx_tenants_deleted ON tenants(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;
```

### Implementation Pattern

```typescript
// lib/softDelete.ts

interface SoftDeleteResult {
  success: boolean;
  deletedAt: Date;
  deletedBy: string;
  affectedRows: number;
}

// Soft delete single record
async function softDelete(table: string, id: string, deletedBy: string): Promise<SoftDeleteResult> {
  const now = new Date();

  const result = await db.$executeRaw`
    UPDATE ${table}
    SET deleted_at = ${now}, deleted_by = ${deletedBy}, updated_at = ${now}
    WHERE id = ${id} AND deleted_at IS NULL
  `;

  return {
    success: result > 0,
    deletedAt: now,
    deletedBy,
    affectedRows: result,
  };
}

// Soft delete tenant dengan cascade ke users
async function softDeleteTenant(tenantId: string, deletedBy: string): Promise<SoftDeleteResult> {
  const now = new Date();

  return await db.$transaction(async (tx) => {
    // 1. Soft delete semua users di tenant
    const usersDeleted = await tx.users.updateMany({
      where: { tenant_id: tenantId, deleted_at: null },
      data: { deleted_at: now, deleted_by: deletedBy },
    });

    // 2. Soft delete semua halaqah di tenant
    const halaqahDeleted = await tx.halaqah.updateMany({
      where: { tenant_id: tenantId, deleted_at: null },
      data: { deleted_at: now, deleted_by: deletedBy },
    });

    // 3. Soft delete tenant
    await tx.tenants.update({
      where: { id: tenantId },
      data: { deleted_at: now, deleted_by: deletedBy },
    });

    return {
      success: true,
      deletedAt: now,
      deletedBy,
      affectedRows: 1 + usersDeleted.count + halaqahDeleted.count,
    };
  });
}

// Restore soft deleted record
async function restore(table: string, id: string): Promise<boolean> {
  const result = await db.$executeRaw`
    UPDATE ${table}
    SET deleted_at = NULL, deleted_by = NULL, updated_at = NOW()
    WHERE id = ${id} AND deleted_at IS NOT NULL
  `;

  return result > 0;
}
```

### Query Patterns

```typescript
// Prisma middleware untuk auto-filter soft deleted records
prisma.$use(async (params, next) => {
  // Tables dengan soft delete
  const softDeleteTables = ['tenants', 'users', 'halaqah'];

  if (softDeleteTables.includes(params.model?.toLowerCase() || '')) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      // Auto filter deleted records
      params.args = params.args || {};
      params.args.where = {
        ...params.args.where,
        deleted_at: null,
      };
    }

    if (params.action === 'delete') {
      // Convert delete to soft delete
      params.action = 'update';
      params.args.data = { deleted_at: new Date() };
    }

    if (params.action === 'deleteMany') {
      // Convert deleteMany to updateMany
      params.action = 'updateMany';
      params.args.data = { deleted_at: new Date() };
    }
  }

  return next(params);
});

// Query dengan include deleted (untuk admin)
async function findAllIncludeDeleted(tenantId: string) {
  return await db.users.findMany({
    where: {
      tenant_id: tenantId,
      // Tidak filter deleted_at
    },
  });
}

// Query hanya deleted records
async function findDeleted(tenantId: string) {
  return await db.users.findMany({
    where: {
      tenant_id: tenantId,
      deleted_at: { not: null },
    },
  });
}
```

### API Endpoints (Admin)

```typescript
// routes/admin/tenants.ts

// Soft delete tenant
app.delete('/admin/tenants/:id', superAdminOnly, async (c) => {
  const tenantId = c.req.param('id');
  const adminId = c.get('user').id;

  // Check if tenant exists
  const tenant = await db.tenants.findFirst({
    where: { id: tenantId, deleted_at: null },
  });

  if (!tenant) {
    return c.json({ error: 'Tenant tidak ditemukan' }, 404);
  }

  // Soft delete dengan cascade
  const result = await softDeleteTenant(tenantId, adminId);

  // Log action
  await db.auditLog.create({
    data: {
      action: 'SOFT_DELETE_TENANT',
      target_type: 'tenant',
      target_id: tenantId,
      performed_by: adminId,
      metadata: { affectedRows: result.affectedRows },
    },
  });

  return c.json({
    success: true,
    message: `Tenant dan ${result.affectedRows - 1} data terkait berhasil dihapus`,
    deletedAt: result.deletedAt,
  });
});

// Restore tenant
app.post('/admin/tenants/:id/restore', superAdminOnly, async (c) => {
  const tenantId = c.req.param('id');
  const adminId = c.get('user').id;

  // Check if tenant is deleted
  const tenant = await db.tenants.findFirst({
    where: { id: tenantId, deleted_at: { not: null } },
  });

  if (!tenant) {
    return c.json({ error: 'Tenant tidak ditemukan atau tidak dalam status terhapus' }, 404);
  }

  // Restore tenant dan users
  await db.$transaction(async (tx) => {
    await tx.tenants.update({
      where: { id: tenantId },
      data: { deleted_at: null, deleted_by: null },
    });

    await tx.users.updateMany({
      where: { tenant_id: tenantId, deleted_at: tenant.deleted_at },
      data: { deleted_at: null, deleted_by: null },
    });
  });

  // Log action
  await db.auditLog.create({
    data: {
      action: 'RESTORE_TENANT',
      target_type: 'tenant',
      target_id: tenantId,
      performed_by: adminId,
    },
  });

  return c.json({ success: true, message: 'Tenant berhasil di-restore' });
});

// List deleted tenants (trash)
app.get('/admin/tenants/trash', superAdminOnly, async (c) => {
  const deleted = await db.tenants.findMany({
    where: { deleted_at: { not: null } },
    include: {
      _count: { select: { users: true } },
    },
    orderBy: { deleted_at: 'desc' },
  });

  return c.json(deleted);
});

// Permanent delete (hard delete) - hanya jika sudah di trash > 30 hari
app.delete('/admin/tenants/:id/permanent', superAdminOnly, async (c) => {
  const tenantId = c.req.param('id');

  const tenant = await db.tenants.findFirst({
    where: {
      id: tenantId,
      deleted_at: {
        not: null,
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // > 30 hari
      },
    },
  });

  if (!tenant) {
    return c.json(
      {
        error: 'Tenant harus di trash minimal 30 hari sebelum permanent delete',
      },
      400
    );
  }

  // Hard delete (gunakan dengan sangat hati-hati!)
  await db.$transaction(async (tx) => {
    // Delete related data first
    await tx.setoran.deleteMany({ where: { user: { tenant_id: tenantId } } });
    await tx.hafalanProgress.deleteMany({ where: { user: { tenant_id: tenantId } } });
    await tx.users.deleteMany({ where: { tenant_id: tenantId } });
    await tx.tenants.delete({ where: { id: tenantId } });
  });

  return c.json({ success: true, message: 'Tenant dihapus permanen' });
});
```

### UI Considerations (Frontend)

```typescript
// components/DeleteConfirmModal.tsx
interface DeleteConfirmProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ itemName, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <Modal>
      <h3>Hapus {itemName}?</h3>
      <p>
        Data akan dipindahkan ke <strong>Trash</strong> dan dapat di-restore
        dalam 30 hari. Setelah 30 hari, data akan dihapus permanen.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button variant="destructive" onClick={onConfirm}>Hapus</Button>
      </div>
    </Modal>
  );
}

// Admin Trash Page
function TrashPage() {
  const { data: deletedTenants } = useQuery(['deleted-tenants'], getDeletedTenants);

  return (
    <div>
      <h1>Trash</h1>
      <p className="text-gray-500">
        Data yang dihapus akan tersimpan di sini selama 30 hari
      </p>

      <Table>
        {deletedTenants?.map((tenant) => (
          <TableRow key={tenant.id}>
            <td>{tenant.name}</td>
            <td>{formatDate(tenant.deleted_at)}</td>
            <td>{daysUntilPermanentDelete(tenant.deleted_at)} hari lagi</td>
            <td>
              <Button onClick={() => restore(tenant.id)}>Restore</Button>
            </td>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
```

### Checklist Soft Delete

- [ ] Tambah kolom `deleted_at` dan `deleted_by` ke semua tabel
- [ ] Buat index untuk query performance
- [ ] Implement Prisma middleware untuk auto-filter
- [ ] API endpoint untuk soft delete
- [ ] API endpoint untuk restore
- [ ] API endpoint untuk list trash
- [ ] API endpoint untuk permanent delete (dengan validasi 30 hari)
- [ ] Audit logging untuk semua delete/restore actions
- [ ] UI confirmation modal
- [ ] UI trash/recycle bin page
- [ ] Scheduled job untuk auto permanent delete > 30 hari

---

## API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login (email/phone + password)
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
POST   /api/auth/verify-email      # Verify email
```

### Super Admin

```
GET    /api/admin/tenants          # List all tenants
POST   /api/admin/tenants          # Create tenant
GET    /api/admin/tenants/:id      # Get tenant detail
PUT    /api/admin/tenants/:id      # Update tenant
DELETE /api/admin/tenants/:id      # Delete tenant

GET    /api/admin/analytics        # Platform analytics
GET    /api/admin/revenue          # Revenue reports
GET    /api/admin/users            # All users across tenants
```

### Tenant Admin

```
GET    /api/tenant/profile         # Get tenant profile
PUT    /api/tenant/profile         # Update tenant profile
PUT    /api/tenant/api-key         # Set Gemini API key

GET    /api/tenant/users           # List tenant users
POST   /api/tenant/users           # Create user
PUT    /api/tenant/users/:id       # Update user
DELETE /api/tenant/users/:id       # Delete user
POST   /api/tenant/users/bulk      # Bulk create users (CSV)

GET    /api/tenant/analytics       # Tenant analytics
GET    /api/tenant/usage           # API usage stats

GET    /api/tenant/subscription    # Current subscription
POST   /api/tenant/subscription    # Upgrade/change plan
```

### User

```
GET    /api/user/profile           # Get profile
PUT    /api/user/profile           # Update profile
PUT    /api/user/api-key           # Set personal API key (BYOK)
PUT    /api/user/password          # Change password
```

### AI Services (Shared)

```
POST   /api/ai/chat                # General AI chat
POST   /api/ai/chat/stream         # Streaming chat response

# Vision
POST   /api/ai/vision/analyze      # Analyze image
POST   /api/ai/vision/ocr          # OCR Arabic text

# Audio
POST   /api/ai/audio/transcribe    # Transcribe audio
POST   /api/ai/audio/tajweed       # Check tajweed
```

---

## Security Requirements

### Authentication & Authorization

- [ ] JWT with short expiry (15 min) + refresh token (7 days)
- [ ] Role-based access control (RBAC)
- [ ] Tenant isolation (users can only access own tenant data)
- [ ] API key encryption at rest (AES-256)
- [ ] Rate limiting per user/tenant/IP

### Data Protection

- [ ] All API keys encrypted before storage
- [ ] HTTPS only
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Input validation & sanitization

### Audit & Logging

- [ ] Login attempts logging
- [ ] API usage logging
- [ ] Admin action audit trail
- [ ] Error logging (Sentry/similar)

---

## Anti-Spam & Registration Security

### Problem Statement

Netizen Indonesia sering iseng spam registrasi fake. Perlu proteksi berlapis untuk mencegah:

- Spam bot registrasi massal
- Fake data injection
- Abuse API gratis
- Multiple account per orang

### Protection Layers

```
┌─────────────────────────────────────────────────────────────┐
│              REGISTRATION PROTECTION FLOW                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Request                                               │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐                                           │
│  │ Layer 1:    │  Cloudflare Turnstile (CAPTCHA)           │
│  │ Bot Check   │  - Gratis, privacy-friendly               │
│  └──────┬──────┘  - Block automated requests               │
│         │ ✓                                                 │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ Layer 2:    │  Rate Limit by IP                         │
│  │ IP Limit    │  - Max 3 registrasi/IP/24 jam             │
│  └──────┬──────┘  - Using Upstash Redis (free tier)        │
│         │ ✓                                                 │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ Layer 3:    │  Device Fingerprint                       │
│  │ Device ID   │  - FingerprintJS (free tier)              │
│  └──────┬──────┘  - 1 device = 1 account                   │
│         │ ✓                                                 │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ Layer 4:    │  Phone/Email OTP                          │
│  │ Verify      │  - Wajib verifikasi sebelum aktif         │
│  └──────┬──────┘  - IP di-lock sampai verifikasi done      │
│         │ ✓                                                 │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ Layer 5:    │  Honeypot Fields                          │
│  │ Trap Bot    │  - Hidden field yang bot isi              │
│  └──────┬──────┘  - Jika terisi = reject                   │
│         │ ✓                                                 │
│         ▼                                                   │
│  Account Created (status: pending_verification)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema (Anti-Spam)

```sql
-- Registration attempts tracking
CREATE TABLE registration_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45) NOT NULL,
  device_fingerprint VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending', -- pending, verified, blocked, expired
  turnstile_token TEXT,

  -- Tracking
  attempt_count INTEGER DEFAULT 1,
  last_attempt_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  blocked_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours'
);

-- Index for fast lookup
CREATE INDEX idx_reg_attempts_ip ON registration_attempts(ip_address);
CREATE INDEX idx_reg_attempts_device ON registration_attempts(device_fingerprint);
CREATE INDEX idx_reg_attempts_status ON registration_attempts(status);

-- Device fingerprints (untuk tracking multi-account)
CREATE TABLE device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  ip_addresses TEXT[], -- array of IPs used
  user_agent TEXT,
  first_seen_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT false,
  block_reason TEXT
);

-- Blocked IPs/Devices
CREATE TABLE blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL, -- 'ip', 'device', 'email_domain', 'phone_prefix'
  value VARCHAR(255) NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES users(id), -- admin who blocked
  expires_at TIMESTAMP, -- null = permanent
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(type, value)
);
```

### Implementation: Layer 1 - Cloudflare Turnstile

```typescript
// lib/turnstile.ts
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResult {
  success: boolean;
  error_codes?: string[];
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  });

  const result: TurnstileResult = await response.json();
  return result.success;
}
```

**Frontend (React):**

```tsx
// components/TurnstileWidget.tsx
import { Turnstile } from '@marsidev/react-turnstile';

export function TurnstileWidget({ onSuccess }: { onSuccess: (token: string) => void }) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onSuccess}
      options={{
        theme: 'light',
        language: 'id',
      }}
    />
  );
}
```

### Implementation: Layer 2 - IP Rate Limiting

```typescript
// lib/rateLimit.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Rate limit untuk registrasi: 3 per IP per 24 jam
export const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '24h'),
  prefix: 'ratelimit:register',
});

// Rate limit untuk OTP request: 5 per IP per jam
export const otpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1h'),
  prefix: 'ratelimit:otp',
});

// Check if IP is rate limited
export async function checkRegistrationLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const { success, remaining, reset } = await registrationLimiter.limit(ip);
  return {
    allowed: success,
    remaining,
    resetAt: new Date(reset),
  };
}
```

### Implementation: Layer 3 - Device Fingerprint

```typescript
// Frontend: Collect fingerprint
// lib/fingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
}

// Backend: Validate fingerprint
export async function checkDeviceFingerprint(
  fingerprint: string,
  userId?: string
): Promise<{ allowed: boolean; reason?: string }> {
  // Check if device is blocked
  const blocked = await db.blocklist.findFirst({
    where: { type: 'device', value: fingerprint },
  });

  if (blocked) {
    return { allowed: false, reason: 'Device blocked' };
  }

  // Check if device already has an account
  const existing = await db.deviceFingerprints.findFirst({
    where: { fingerprint, user_id: { not: null } },
  });

  if (existing && existing.user_id !== userId) {
    return { allowed: false, reason: 'Device already registered' };
  }

  return { allowed: true };
}
```

### Implementation: Layer 4 - OTP Verification

```typescript
// lib/otp.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const OTP_EXPIRY = 5 * 60; // 5 minutes

export async function generateOTP(identifier: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.setex(`otp:${identifier}`, OTP_EXPIRY, otp);

  return otp;
}

export async function verifyOTP(identifier: string, otp: string): Promise<boolean> {
  const stored = await redis.get(`otp:${identifier}`);

  if (stored === otp) {
    await redis.del(`otp:${identifier}`);
    return true;
  }

  return false;
}

// Send OTP via SMS (using Fonnte - cheap Indonesian SMS gateway)
export async function sendSmsOTP(phone: string, otp: string): Promise<boolean> {
  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: process.env.FONNTE_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: phone,
      message: `[IslamicApp] Kode OTP Anda: ${otp}. Berlaku 5 menit. Jangan bagikan ke siapapun.`,
    }),
  });

  return response.ok;
}

// Send OTP via Email (using Resend - free tier 100/day)
export async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@islamicapp.id',
      to: email,
      subject: 'Kode Verifikasi - IslamicApp',
      html: `
        <h2>Assalamu'alaikum</h2>
        <p>Kode verifikasi Anda adalah:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>Kode berlaku selama 5 menit.</p>
        <p>Jika Anda tidak melakukan registrasi, abaikan email ini.</p>
      `,
    }),
  });

  return response.ok;
}
```

### Implementation: Layer 5 - Honeypot

```typescript
// Honeypot field - hidden dari user normal, tapi bot akan mengisinya
// Frontend form
<form onSubmit={handleSubmit}>
  <input type="text" name="name" placeholder="Nama" required />
  <input type="email" name="email" placeholder="Email" required />

  {/* Honeypot - hidden with CSS */}
  <input
    type="text"
    name="website"
    style={{ position: 'absolute', left: '-9999px' }}
    tabIndex={-1}
    autoComplete="off"
  />

  <button type="submit">Daftar</button>
</form>

// Backend validation
export async function validateRegistration(data: any): Promise<{
  valid: boolean;
  reason?: string;
}> {
  // Check honeypot
  if (data.website && data.website.length > 0) {
    // Log for analysis but don't tell them why
    console.log('Honeypot triggered:', data);
    return { valid: false, reason: 'Invalid request' };
  }

  return { valid: true };
}
```

### Complete Registration Flow

```typescript
// routes/auth/register.ts
import { Hono } from 'hono';
import { verifyTurnstile } from '@/lib/turnstile';
import { checkRegistrationLimit } from '@/lib/rateLimit';
import { checkDeviceFingerprint } from '@/lib/fingerprint';
import { generateOTP, sendSmsOTP, sendEmailOTP } from '@/lib/otp';

const app = new Hono();

app.post('/register', async (c) => {
  const body = await c.req.json();
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

  // Layer 5: Honeypot check
  if (body.website) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  // Layer 1: Turnstile verification
  const turnstileValid = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstileValid) {
    return c.json({ error: 'Verifikasi CAPTCHA gagal' }, 400);
  }

  // Layer 2: IP rate limit
  const ipLimit = await checkRegistrationLimit(ip);
  if (!ipLimit.allowed) {
    return c.json(
      {
        error: 'Terlalu banyak percobaan. Coba lagi nanti.',
        retryAfter: ipLimit.resetAt,
      },
      429
    );
  }

  // Layer 3: Device fingerprint
  const deviceCheck = await checkDeviceFingerprint(body.deviceFingerprint);
  if (!deviceCheck.allowed) {
    return c.json(
      {
        error: 'Perangkat ini sudah terdaftar dengan akun lain',
      },
      400
    );
  }

  // Check if IP has pending unverified registration
  const pendingReg = await db.registrationAttempts.findFirst({
    where: {
      ip_address: ip,
      status: 'pending',
      expires_at: { gt: new Date() },
    },
  });

  if (pendingReg) {
    return c.json(
      {
        error:
          'Anda memiliki registrasi yang belum diverifikasi. Silakan verifikasi terlebih dahulu.',
        registrationId: pendingReg.id,
      },
      400
    );
  }

  // Create registration attempt
  const registration = await db.registrationAttempts.create({
    data: {
      ip_address: ip,
      device_fingerprint: body.deviceFingerprint,
      email: body.email,
      phone: body.phone,
      status: 'pending',
    },
  });

  // Layer 4: Send OTP
  const otp = await generateOTP(body.phone || body.email);

  if (body.phone) {
    await sendSmsOTP(body.phone, otp);
  } else {
    await sendEmailOTP(body.email, otp);
  }

  return c.json({
    success: true,
    message: 'Kode OTP telah dikirim. Silakan verifikasi.',
    registrationId: registration.id,
    verifyVia: body.phone ? 'sms' : 'email',
  });
});

// Verify OTP and complete registration
app.post('/register/verify', async (c) => {
  const body = await c.req.json();
  const ip = c.req.header('x-forwarded-for') || 'unknown';

  // Find registration attempt
  const registration = await db.registrationAttempts.findFirst({
    where: {
      id: body.registrationId,
      ip_address: ip,
      status: 'pending',
      expires_at: { gt: new Date() },
    },
  });

  if (!registration) {
    return c.json({ error: 'Registrasi tidak ditemukan atau expired' }, 400);
  }

  // Verify OTP
  const identifier = registration.phone || registration.email;
  const otpValid = await verifyOTP(identifier!, body.otp);

  if (!otpValid) {
    return c.json({ error: 'Kode OTP salah atau expired' }, 400);
  }

  // Create actual user account
  const user = await db.users.create({
    data: {
      email: registration.email,
      phone: registration.phone,
      password_hash: await hashPassword(body.password),
      full_name: body.fullName,
      email_verified: !!registration.email,
      phone_verified: !!registration.phone,
    },
  });

  // Link device fingerprint
  await db.deviceFingerprints.create({
    data: {
      fingerprint: registration.device_fingerprint!,
      user_id: user.id,
      ip_addresses: [ip],
    },
  });

  // Mark registration as verified
  await db.registrationAttempts.update({
    where: { id: registration.id },
    data: { status: 'verified', verified_at: new Date() },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  return c.json({
    success: true,
    user: { id: user.id, name: user.full_name, email: user.email },
    ...tokens,
  });
});

export default app;
```

### Admin Tools: Manage Blocklist

```typescript
// Admin can block suspicious IPs/devices
app.post('/admin/blocklist', adminOnly, async (c) => {
  const body = await c.req.json();

  await db.blocklist.create({
    data: {
      type: body.type, // 'ip', 'device', 'email_domain'
      value: body.value,
      reason: body.reason,
      blocked_by: c.get('user').id,
      expires_at: body.permanent ? null : body.expiresAt,
    },
  });

  return c.json({ success: true });
});

// View suspicious registrations
app.get('/admin/suspicious', adminOnly, async (c) => {
  // IPs with many failed attempts
  const suspicious = await db.$queryRaw`
    SELECT 
      ip_address,
      COUNT(*) as attempt_count,
      COUNT(DISTINCT device_fingerprint) as device_count,
      MAX(created_at) as last_attempt
    FROM registration_attempts
    WHERE created_at > NOW() - INTERVAL '7 days'
    GROUP BY ip_address
    HAVING COUNT(*) > 5 OR COUNT(DISTINCT device_fingerprint) > 3
    ORDER BY attempt_count DESC
  `;

  return c.json(suspicious);
});
```

### Free Tier Services Used

| Service                  | Free Tier                 | Purpose                    |
| ------------------------ | ------------------------- | -------------------------- |
| **Cloudflare Turnstile** | Unlimited                 | CAPTCHA                    |
| **Upstash Redis**        | 10k commands/day          | Rate limiting, OTP storage |
| **FingerprintJS**        | 20k identifications/month | Device fingerprint         |
| **Resend**               | 100 emails/day            | Email OTP                  |
| **Fonnte**               | ~Rp 350/SMS               | SMS OTP (murah)            |

### Checklist Anti-Spam

- [ ] Cloudflare Turnstile integration
- [ ] IP rate limiting dengan Upstash
- [ ] Device fingerprinting
- [ ] OTP via Email (Resend)
- [ ] OTP via SMS (Fonnte)
- [ ] Honeypot fields
- [ ] Registration attempts tracking
- [ ] Admin blocklist management
- [ ] Suspicious activity dashboard

---

## Infrastructure

### Minimum Requirements (Production)

| Component  | Specification              |
| ---------- | -------------------------- |
| API Server | 2 vCPU, 4GB RAM            |
| Database   | 2 vCPU, 4GB RAM, 100GB SSD |
| Redis      | 1 vCPU, 2GB RAM            |
| Storage    | 100GB (scalable)           |

### Recommended Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                  (Cloudflare/Nginx)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  API #1   │  │  API #2   │  │  API #3   │
│  (Hono)   │  │  (Hono)   │  │  (Hono)   │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ PostgreSQL│ │   Redis   │ │  Storage  │
│  Primary  │ │  Cluster  │ │   (GCS)   │
└───────────┘ └───────────┘ └───────────┘
```

---

## Gemini API Integration

### Models Used

| Model                  | Use Case                        |
| ---------------------- | ------------------------------- |
| `gemini-2.0-flash`     | General chat, fast responses    |
| `gemini-2.0-flash-exp` | Complex analysis, vision, audio |

### Integration Pattern

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages, options = {}) {
    const model = this.genAI.getGenerativeModel({
      model: options.model || 'gemini-2.0-flash',
    });

    const chat = model.startChat({
      history: messages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
      },
    });

    const result = await chat.sendMessage(messages.at(-1).content);
    return result.response.text();
  }

  async analyzeImage(imageBuffer, prompt) {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBuffer.toString('base64'), mimeType: 'image/jpeg' } },
    ]);

    return result.response.text();
  }

  async analyzeAudio(audioBuffer, prompt) {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: audioBuffer.toString('base64'), mimeType: 'audio/wav' } },
    ]);

    return result.response.text();
  }
}
```

---

## Development Checklist

### Phase 1: Core Infrastructure

- [ ] Project setup (Node.js + TypeScript)
- [ ] Database schema & migrations
- [ ] Authentication system (JWT)
- [ ] Multi-tenant middleware
- [ ] Role-based authorization
- [ ] API key management & encryption
- [ ] Rate limiting

### Phase 2: Admin & Tenant Management

- [ ] Super admin endpoints
- [ ] Tenant CRUD
- [ ] User management per tenant
- [ ] Subscription & billing integration
- [ ] Usage tracking

### Phase 3: AI Integration

- [ ] Gemini API wrapper
- [ ] API key resolution logic
- [ ] Chat endpoint
- [ ] Vision endpoint
- [ ] Audio endpoint
- [ ] Usage metering

### Phase 4: Production Ready

- [ ] Error handling & logging
- [ ] Input validation
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation (OpenAPI/Swagger)
- [ ] Deployment scripts
