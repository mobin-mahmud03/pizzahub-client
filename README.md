# 🍕 PizzaHub — Client

Next.js front-end for **PizzaHub**, a full-stack pizza marketplace where customers browse and order, vendors manage their menus and subscription, and admins moderate the platform.

Built with **Next.js 16 App Router**, **React 19**, **Tailwind CSS v4**, and **ShadCN UI** (on Base UI primitives) — compiled with webpack and the React Compiler for optimised production builds.

---

## ✨ Features

| Area | What it does |
|---|---|
| **Public menu** | Browse all approved pizza listings; search by keyword, filter by category & location, sort by price or rating, paginate results |
| **Item detail** | Full item page with photo, description, vendor info, reviews, and an order-placement dialog |
| **Authentication** | Email/password login and registration with role selection (Customer / Vendor); JWT stored and sent via Axios interceptor |
| **Role-based routing** | `dashboard/layout.tsx` reads the session role and redirects wrong-role users; no flash during session hydration |
| **Customer dashboard** | Overview stats, full order history with status timeline |
| **Vendor dashboard** | Menu item CRUD (add / edit / delete / toggle active), customer order management, subscription upgrade flow |
| **Admin dashboard** | User management (block/unblock), menu item moderation (approve/reject), transaction history |
| **Stripe payments** | Redirect to Stripe Checkout; `payment/success` page activates premium badge; `payment/cancel` returns gracefully |
| **Image uploads** | Photos proxied through the server to ImgBB; preview shown before submission |
| **ShadCN UI components** | Button, Card, Input, Label, Textarea, Select, Dialog, Table, Badge, Tabs, DropdownMenu, Avatar, Skeleton — all built on Base UI |
| **Animated UI** | Framer Motion page transitions and micro-interactions |
| **Toast notifications** | Sonner toasts for all success, error, and info feedback |
| **Theme support** | next-themes dark/light toggle wired to Tailwind CSS variables |
| **Skeleton loaders** | Every data-fetching state has a Skeleton placeholder; no layout shift |
| **Custom 404** | Catch-all `[...not_found]` route with friendly error page |

---

## 🛠 Technology Stack

### Runtime dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.4.6 | App Router framework; file-based routing, RSC, Image optimisation |
| `react` | 19.3.0 | UI rendering with the React Compiler enabled |
| `react-dom` | 19.3.0 | DOM renderer |
| `@base-ui/react` | ^1.9.0 | Headless UI primitives underlying all ShadCN components |
| `shadcn` | ^4.23.1 | Component CLI that scaffolds ShadCN components into `src/components/ui/` |
| `axios` | ^1.21.1 | HTTP client; request interceptor attaches `Authorization: Bearer` header |
| `framer-motion` | ^14.14.0 | Page and element animations |
| `lucide-react` | ^1.77.0 | Icon set used throughout the UI |
| `sonner` | ^2.0.8 | Toast notification library |
| `next-themes` | ^0.4.6 | Dark/light theme management with SSR support |
| `class-variance-authority` | ^0.7.1 | Variant-based className composition for ShadCN components |
| `clsx` | ^2.1.1 | Conditional className utility |
| `cn` | ^0.5.2 | Merged `clsx` + `tailwind-merge` helper (installed by ShadCN init) |
| `tailwind-merge` | ^3.7.1 | Merges conflicting Tailwind classes safely |
| `tw-animate-css` | ^1.4.0 | Pre-built Tailwind animation utilities |

### Dev dependencies

| Package | Purpose |
|---|---|
| `tailwindcss` | v4.3.3 — CSS-first config, no `tailwind.config.js` needed |
| `@tailwindcss/postcss` | PostCSS plugin for Tailwind v4 |
| `postcss` | PostCSS runner |
| `babel-plugin-react-compiler` | Required by `reactCompiler: true` in `next.config.ts` |
| `typescript` | Static typing |
| `@types/node` / `@types/react` / `@types/react-dom` | Type definitions |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                     # Root layout — Geist font, ThemeProvider, Toaster
│   ├── page.tsx                       # Home / landing page (featured items)
│   ├── not-found.tsx                  # Next.js 404 boundary
│   ├── [...not_found]/page.tsx        # Catch-all 404 for unmatched routes
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── menu/
│   │   ├── page.tsx                   # Full menu with search + filters
│   │   └── [id]/page.tsx              # Item detail + order dialog
│   ├── dashboard/
│   │   ├── layout.tsx                 # Auth guard — redirects by role
│   │   ├── customer/
│   │   │   ├── page.tsx               # Overview + stat cards
│   │   │   ├── orders/page.tsx        # Full order history + timeline
│   │   │   └── profile/page.tsx
│   │   ├── vendor/
│   │   │   ├── page.tsx               # Overview + menu CRUD + order management
│   │   │   └── profile/page.tsx
│   │   └── admin/
│   │       ├── page.tsx               # Overview + transaction history
│   │       ├── users/page.tsx         # Block/unblock users
│   │       └── items/page.tsx         # Approve/reject menu items
│   ├── payment/
│   │   ├── success/page.tsx
│   │   └── cancel/page.tsx
│   └── profile/page.tsx               # Shared profile settings wrapper
├── components/
│   ├── ui/                            # ShadCN components (do not edit manually)
│   │   └── avatar, badge, button, card, dialog, dropdown-menu,
│   │       input, label, select, skeleton, table, tabs, textarea
│   ├── dashboard/
│   │   └── ProfileSettingsForm.tsx    # Reusable profile form
│   ├── Navbar.tsx                     # Top nav — DropdownMenu + Avatar
│   ├── Footer.tsx
│   ├── PizzaCard.tsx                  # Menu item card (equal-height grid)
│   ├── StatusBadge.tsx                # Order status colour chip
│   ├── StatsCard.tsx                  # Dashboard stat card
│   ├── EmptyState.tsx
│   ├── LoadingSpinner.tsx
│   └── ThemeProvider.tsx
├── context/
│   └── AuthContext.tsx                # Auth state — user, token, login, logout, refreshUser
└── lib/
    └── api.ts                         # Axios instance with auth interceptor
```

---

## 🚀 Installation

### Prerequisites

- Node.js 20+
- npm 10+
- The PizzaHub server running (or its deployed URL in `NEXT_PUBLIC_API_URL`)

### Steps

```bash
# 1. Clone the repository
git clone <CLIENT_REPO_URL>
cd pizzahub-client

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Edit .env.local and fill in all required values (see Environment Variables below)
```

> [!NOTE]
> `babel-plugin-react-compiler` is required at build time because `next.config.ts` enables `reactCompiler: true`. It is listed as a dev dependency and installed automatically with `npm install`.

---

## ▶️ Running Locally

```bash
# Development server (hot reload)
npm run dev

# Production build  (uses webpack — do not use --turbopack)
npm run build
npm start

# Lint
npm run lint
```

The app runs at `http://localhost:3000` by default.

> [!IMPORTANT]
> Always use `npm run build` (not `next build --turbopack`) — the build script passes `--webpack` explicitly because `babel-plugin-react-compiler` is not compatible with Turbopack.

---

## 🌐 Links

| Resource | URL |
|---|---|
| **Live site** | `<LIVE_SITE_URL>` |
| **Client repository** | https://github.com/mobin-mahmud03/pizzahub-client |
| **Server repository** | https://github.com/mobin-mahmud03/pizzahub-server |

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in your own values. **Never commit `.env.local`.**

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API server (e.g. `http://localhost:5000/api`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key used by the Checkout redirect |

---

## 🗺 Pages & Role Dashboards

### Public pages (no login required)

| Route | Description |
|---|---|
| `/` | Home — hero section and featured pizza listings |
| `/menu` | Full menu with live search, category/location filters, sort, and pagination |
| `/menu/[id]` | Item detail — description, vendor info, reviews; order dialog requires login |
| `/auth/login` | Email/password login with demo credential pills |
| `/auth/register` | Sign-up with role selection (Customer or Vendor) |

### Protected pages (login required)

| Route | Access | Description |
|---|---|---|
| `/profile` | All roles | Shared profile settings — name, photo, business name |
| `/payment/success` | Vendor | Stripe checkout success; activates premium badge |
| `/payment/cancel` | Vendor | Stripe checkout cancelled; returns to subscription page |

### Customer dashboard (`/dashboard/customer/*`)

| Route | Description |
|---|---|
| `/dashboard/customer` | Overview — stat cards (orders placed, spending, favourite items) |
| `/dashboard/customer/orders` | Full order history with expandable status timeline |
| `/dashboard/customer/profile` | Profile settings |

### Vendor dashboard (`/dashboard/vendor/*`)

| Route | Description |
|---|---|
| `/dashboard/vendor` | Overview — stat cards, menu item CRUD (add / edit / delete / toggle active / image upload), customer order management (update status), subscription upgrade button |
| `/dashboard/vendor/profile` | Profile and business name settings |

> [!NOTE]
> Free-plan vendors are limited to **3 active menu items**. Attempting to add a fourth shows an upgrade prompt. Premium plan is activated via Stripe Checkout and expires after one month; the server auto-downgrades on the next authenticated request.

### Admin dashboard (`/dashboard/admin/*`)

| Route | Description |
|---|---|
| `/dashboard/admin` | Overview — platform stat cards and transaction history table |
| `/dashboard/admin/users` | User list — block or unblock any customer or vendor account |
| `/dashboard/admin/items` | Menu item moderation — approve or reject pending submissions |

### Route guards

`dashboard/layout.tsx` checks the authenticated user's role **after the session has loaded**. While loading it renders a spinner — it never redirects prematurely. Once the session resolves:

- Unauthenticated users → `/auth/login`
- Wrong-role users (e.g. a customer visiting `/dashboard/vendor`) → their own dashboard
- Correct role → content rendered

---

## 🎨 UI Component Notes

ShadCN was initialised with the **Base UI** adapter (not Radix UI). Components live in `src/components/ui/` and use `@base-ui/react` primitives (`useRender`, `mergeProps`). Do **not** mix in Radix UI packages.

The `cn` helper comes from the `cn` npm package (installed by `shadcn init`), **not** from a local `@/lib/utils` file.

Tailwind v4 uses a CSS-first config — all theme tokens (colours, radii, fonts) are defined as CSS custom properties in `src/app/globals.css`. There is no `tailwind.config.js`.
