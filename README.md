# PizzaHub Client — Next.js Food Ordering Platform 🍕

PizzaHub is a pizza ordering and delivery web application built with Next.js 16 (App Router), Tailwind CSS, Framer Motion, and TypeScript. Customers discover local pizza shops, browse menus with live filters and sorting, place orders with delivery instructions, and track order status timelines. Vendors manage menus, accept/reject customer orders, and upgrade to Premium via Stripe.

## 🚀 Live Links & Repositories
- **Client GitHub Repository**: `https://github.com/your-username/pizzahub-client`
- **Server GitHub Repository**: `https://github.com/your-username/pizzahub-server`
- **Live Production Website**: `https://pizzahub.vercel.app`

---

## 🌟 Important Features
1. **Dynamic Homepage**:
   - High-impact hero banner with Framer Motion animations.
   - Dynamic **Featured Menu Items** (at least 6 approved database items with badges & direct ordering).
   - Dynamic **Pizza Categories** exploring Classic, Vegetarian, Meat Lovers, Gourmet, Sides, and Desserts.
   - Required **Why Choose PizzaHub?** section and 3-step **How PizzaHub Works**.
2. **Browse Menu**:
   - Live full-text search by pizza name, toppings, or ingredients.
   - Multi-parameter filtering by Category and Location (Brooklyn, Greenwich Village, Downtown).
   - **Challenge 1**: Ascending and descending price sorting, newest additions, and rating sort.
   - Responsive equal-height card grid, loading skeletons, and empty states.
3. **Item Details (`/menu/[id]`)**:
   - Multi-image gallery with thumbnail switcher.
   - Comprehensive description, pricing, and pizzeria profile info.
   - Protected Food Order Modal (delivery date & address, duplicate order prevention).
   - Customer review and 5-star rating submission.
4. **Three Distinct Role-Based Dashboards**:
   - **Customer Dashboard**: Overview metrics, full order history, order cancellation for pending items, and interactive **Order Status Timeline**.
   - **Vendor Dashboard**: Overview statistics, menu item management (ImgBB image upload, Free tier 3-item limit, Premium unlimited), customer order accept/reject, and Stripe subscription upgrade.
   - **Admin Dashboard**: Platform metrics & visual bar graphs, user management (search, role filter, block/unblock), menu item moderation (approve/reject/delete), and read-only transaction ledger.
5. **Standout Optional Features Implemented**:
   - ✅ **Dark / Light Mode Toggle** (via `next-themes` and CSS variables).
   - ✅ **Customer Reviews & 5-Star Ratings** with live recalculation.
   - ✅ **Order Status Timeline** on order details modal.
   - ✅ **Favorites / Wishlist** customer support.

---

## 🛠 Technology Stack & Dependencies
- **Frontend Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS, ShadCN design system (warm reds, oranges, cream backgrounds)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Toasts**: Sonner (No browser `alert()`)
- **Theme**: `next-themes`
- **HTTP Client**: Axios with JWT Bearer request interceptors

---

## 🔐 Environment Variables
Create a `.env.local` file in the client directory (never committed to GitHub):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🎯 Challenge Requirements Implementation
### 1. Advanced Search and Sorting
- Implemented in `src/app/menu/page.tsx` connecting to `GET /api/menu`:
  - Instant query sync with `search`, `category`, `location`, and `sort` (`price_asc`, `price_desc`, `rating`, `newest`).
  - Seamless UX with immediate loading indicators and empty state resets.

### 2. JWT & Token Verification Flow
- Client attaches `Authorization: Bearer <token>` automatically on every authenticated API request via Axios interceptor in `src/lib/api.ts`.
- Protected dashboard layout checks authenticated session on load; if page reload occurs, cached session is immediately validated with `/auth/me` to ensure user is **never redirected to Login upon reloading a private route**.

### 3. Professional Recruiter-Grade Design
- Warm pizza palette (crimson reds `#dc2626`, deep oven orange `#ea580c`, and warm cream `#fffcf8`).
- Strict card alignment and equal aspect ratios.
- Accessible dark/light mode and modern X social logo.

---

## 🔑 Demo Login Credentials
- **Admin**: `admin@pizzahub.com` / `Admin@123456`
- **Vendor (Premium)**: `mario@pizzahub.com` / `Vendor@123456`
- **Vendor (Free)**: `luigi@pizzahub.com` / `Vendor@123456`
- **Customer**: `customer@pizzahub.com` / `Customer@123456`
- **Stripe Test Card**: `4242 4242 4242 4242`, Expiry: `12/28`, CVC: `123`

---

## 🏃 Local Setup & Installation
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
