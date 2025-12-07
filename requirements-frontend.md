# Frontend Requirements - Islamic AI Platform

## Overview

Frontend web application untuk platform Islamic AI dengan arsitektur multi-tenant. Mendukung 3 interface: **Admin Dashboard**, **Tenant Dashboard**, dan **User Portal**.

---

## Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Framework        | Next.js 14+ (App Router) |
| Language         | TypeScript               |
| Styling          | Tailwind CSS + shadcn/ui |
| State Management | Zustand / TanStack Query |
| Forms            | React Hook Form + Zod    |
| Auth             | NextAuth.js / Auth.js    |
| Realtime         | Socket.io / Pusher       |
| Charts           | Recharts / Chart.js      |
| Deployment       | Vercel                   |

---

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                    # Auth pages (login, register, etc)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── layout.tsx
│   │
│   ├── (admin)/                   # Super Admin Dashboard
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── tenants/
│   │   │   ├── users/
│   │   │   ├── subscriptions/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   └── layout.tsx
│   │
│   ├── (tenant)/                  # Tenant Admin Dashboard
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── classes/               # Kelas/Halaqah
│   │   ├── analytics/
│   │   ├── billing/
│   │   └── settings/
│   │
│   ├── (user)/                    # User Portal
│   │   ├── home/
│   │   ├── profile/
│   │   ├── learn/                 # Ta'lim features
│   │   ├── tahfidz/               # Tahfidz features
│   │   └── settings/
│   │
│   ├── api/                       # API routes (if needed)
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Layout components
│   ├── forms/                     # Form components
│   ├── charts/                    # Chart components
│   └── features/                  # Feature-specific components
│
├── lib/
│   ├── api.ts                     # API client
│   ├── auth.ts                    # Auth utilities
│   ├── utils.ts                   # General utilities
│   └── validations.ts             # Zod schemas
│
├── hooks/                         # Custom React hooks
├── stores/                        # Zustand stores
├── types/                         # TypeScript types
└── styles/                        # Global styles
```

---

## Multi-Tenant Domain Handling

### Middleware untuk Subdomain Detection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract subdomain
  const subdomain = getSubdomain(host);

  // Skip for main domains
  if (['admin', 'api', 'www', ''].includes(subdomain)) {
    return NextResponse.next();
  }

  // Add tenant slug to headers for API calls
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', subdomain);

  return response;
}

function getSubdomain(host: string): string {
  const parts = host.split('.');

  // Handle localhost:3000
  if (host.includes('localhost')) {
    return '';
  }

  // Handle *.islamicapp.id
  if (parts.length >= 3) {
    return parts[0];
  }

  return '';
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Tenant Context Provider

```typescript
// contexts/TenantContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  plan: string;
  settings: Record<string, any>;
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenant() {
      try {
        const response = await fetch('/api/tenant/current');
        if (!response.ok) throw new Error('Tenant not found');

        const data = await response.json();
        setTenant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
```

---

## Pages & Features

### 1. Landing Page (`/`)

**Purpose:** Marketing page untuk platform

**Sections:**

- Hero dengan CTA "Daftar Sekarang"
- Features overview (Tahfidz & Ta'lim)
- Pricing plans
- Testimonials
- FAQ
- Footer dengan contact info

---

### 2. Auth Pages (`/login`, `/register`, etc)

**Login Page:**

- Email/Phone + Password
- Remember me checkbox
- Forgot password link
- Social login (Google) - optional
- Tenant selector (jika user multi-tenant)

**Register Page:**

- Untuk Tenant: Daftar lembaga baru
- Untuk User: Biasanya diundang oleh tenant

**Register Tenant:**

- Nama lembaga
- Email & phone
- Password
- Slug (auto-generated, editable)
- Pilih plan

---

### 3. Super Admin Dashboard (`/admin/*`)

**Dashboard Home:**

- Total tenants (active/inactive)
- Total users
- Revenue overview (MRR, ARR)
- Recent signups
- API usage chart

**Tenants Management:**

- Table: Name, Plan, Users, Status, Created
- Actions: View, Edit, Suspend, Delete
- Filter by plan, status
- Search by name/email
- Bulk actions

**Tenant Detail:**

- Profile info
- User list
- Subscription history
- API usage
- Actions: Change plan, Reset API key

**Analytics:**

- User growth chart
- Revenue chart
- API usage by tenant
- Popular features
- Churn rate

**Settings:**

- Platform settings
- Default API key management
- Email templates
- Pricing configuration

---

### 4. Tenant Admin Dashboard (`/dashboard/*`)

**Dashboard Home:**

- Total students/users
- Active users today
- API usage quota
- Quick actions

**User Management:**

- Table: Name, Email, Status, Last Login
- Actions: View, Edit, Deactivate, Delete
- Bulk import (CSV)
- Invite via email/link

**Classes/Halaqah:**

- Create study groups
- Assign teachers
- Assign students
- Set schedule

**Analytics:**

- Student progress
- Attendance (if applicable)
- API usage per user
- Feature usage

**Billing:**

- Current plan
- Usage stats
- Upgrade/downgrade
- Payment history
- Invoice download

**Settings:**

- Tenant profile
- Logo upload
- API key management
- Custom domain setup
- Notification preferences

---

### 5. User Portal (Student Interface)

**Home:**

- Welcome message
- Daily tasks/reminders
- Progress summary
- Quick access to features

**Profile:**

- Personal info
- Avatar
- Password change
- API key (BYOK) - if on unlimited plan
- Notification settings

---

## UI Components

### Design System

**Colors (Islamic theme):**

```css
:root {
  --primary: #1b5e20; /* Islamic Green */
  --primary-light: #4caf50;
  --primary-dark: #0d3d0d;

  --secondary: #b8860b; /* Gold */
  --secondary-light: #daa520;

  --background: #fafaf5; /* Warm white */
  --foreground: #1a1a1a;

  --muted: #6b7280;
  --border: #e5e7eb;
}
```

**Typography:**

- Headings: `Inter` or `Plus Jakarta Sans`
- Arabic text: `Amiri` or `Scheherazade New`
- Body: `Inter`

### Core Components (shadcn/ui based)

```
components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── table.tsx
├── tabs.tsx
├── avatar.tsx
├── badge.tsx
├── toast.tsx
├── skeleton.tsx
├── form.tsx
└── ...
```

### Custom Components

```
components/features/
├── ai-chat/
│   ├── ChatWindow.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   └── ChatHistory.tsx
│
├── quran/
│   ├── QuranReader.tsx
│   ├── AyahDisplay.tsx
│   ├── TajweedHighlight.tsx
│   └── AudioPlayer.tsx
│
├── user-management/
│   ├── UserTable.tsx
│   ├── UserForm.tsx
│   ├── BulkImport.tsx
│   └── InviteModal.tsx
│
└── analytics/
    ├── StatsCard.tsx
    ├── UsageChart.tsx
    └── ProgressChart.tsx
```

---

## State Management

### Zustand Stores

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'user';
  tenant_id?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

```typescript
// stores/tenantStore.ts
import { create } from 'zustand';

interface TenantState {
  tenant: Tenant | null;
  users: User[];
  setTenant: (tenant: Tenant) => void;
  setUsers: (users: User[]) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  users: [],
  setTenant: (tenant) => set({ tenant }),
  setUsers: (users) => set({ users }),
}));
```

---

## API Integration

### API Client

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return response.json();
  }

  // Auth
  login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Tenants (Admin)
  getTenants(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/admin/tenants?${query}`);
  }

  // Users (Tenant)
  getUsers() {
    return this.request('/tenant/users');
  }

  createUser(data: CreateUserDto) {
    return this.request('/tenant/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI
  chat(messages: Message[]) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }
}

export const api = new ApiClient();
```

### TanStack Query Hooks

```typescript
// hooks/useTenants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useTenants(params?: { page?: number }) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => api.getTenants(params),
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantDto) => api.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
```

---

## Responsive Design

### Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach

```tsx
// Example responsive layout
<div
  className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
"
>
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

---

## Performance Optimization

### Next.js Optimizations

- [ ] Image optimization with `next/image`
- [ ] Font optimization with `next/font`
- [ ] Dynamic imports for heavy components
- [ ] Route prefetching
- [ ] Server Components where possible

### Code Splitting

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const QuranReader = dynamic(() => import('@/components/features/quran/QuranReader'), {
  loading: () => <Skeleton className="h-96" />,
  ssr: false,
});

const Charts = dynamic(() => import('@/components/features/analytics/Charts'), {
  loading: () => <Skeleton className="h-64" />,
});
```

---

## Internationalization (i18n)

### Supported Languages

| Language         | Code | Priority  |
| ---------------- | ---- | --------- |
| Bahasa Indonesia | `id` | Primary   |
| English          | `en` | Secondary |
| Arabic           | `ar` | Tertiary  |

### Setup with next-intl

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

```json
// messages/id.json
{
  "common": {
    "login": "Masuk",
    "register": "Daftar",
    "logout": "Keluar",
    "save": "Simpan",
    "cancel": "Batal"
  },
  "dashboard": {
    "welcome": "Selamat datang, {name}",
    "totalUsers": "Total Pengguna",
    "activeToday": "Aktif Hari Ini"
  }
}
```

---

## Development Checklist

### Phase 1: Foundation

- [ ] Project setup (Next.js + TypeScript)
- [ ] Tailwind CSS + shadcn/ui setup
- [ ] Project structure
- [ ] Auth pages (login, register)
- [ ] Layout components
- [ ] API client setup

### Phase 2: Admin Dashboard

- [ ] Admin layout
- [ ] Dashboard home
- [ ] Tenant management CRUD
- [ ] User overview
- [ ] Basic analytics

### Phase 3: Tenant Dashboard

- [ ] Tenant layout
- [ ] Dashboard home
- [ ] User management
- [ ] Billing page
- [ ] Settings

### Phase 4: User Portal

- [ ] User layout
- [ ] Profile page
- [ ] Home with quick actions
- [ ] Settings

### Phase 5: Polish

- [ ] Responsive design audit
- [ ] Loading states
- [ ] Error handling
- [ ] i18n implementation
- [ ] Performance optimization
- [ ] Accessibility audit
