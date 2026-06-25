# MOOSING — Programming Showroom Management Platform

A premium, dark-mode, gradient-rich, 3D-forward **bilingual (Français 🇫🇷 / العربية 🇩🇿 RTL)** platform for a software/programs showroom. Includes a protected **admin panel** and a customer-facing **public website**, all driven by static mock data held in React Context (fully interactive in-session: create / edit / delete / change status).

## Tech stack
- React 18 + TypeScript (Vite)
- Tailwind CSS (shadcn token structure)
- Framer Motion — every interface opens/closes with `AnimatePresence`
- Three.js + @react-three/fiber + @react-three/drei — 3D hero animations
- Recharts — dashboard charts
- lucide-react — icons
- react-router-dom — routing
- i18next + react-i18next — FR default + AR/RTL toggle

## Getting started
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Login
- **Demo Account** button → instant full-access admin (no typing).
- Or credentials: `admin@moosing.dz` / `moosing2026`.
- **Voir le site** button → opens the public website without logging in.

## Routes
| Path | Screen |
|------|--------|
| `/login` | Animated login (create-admin, demo login, see-website, language toggle) |
| `/admin/dashboard` | Rich stats (counts, donut, bar chart, revenue split, recent activity) |
| `/admin/website-settings` | Contacts + Site Settings tabs |
| `/admin/programs` | Programs CRUD — cards with edit / delete / copy-link |
| `/admin/promotion` | Promotions — program search autofill, inline category, countdown |
| `/admin/commands` | Orders with status workflow + custom "sur mesure" sub-tab |
| `/admin/settings` | Showroom info / Account / Database backup-restore |
| `/site` | Landing — 3D futuristic hero + featured + categories |
| `/site/programs` | All programs with category filter + live search |
| `/site/order/:programId` | Order page (deep-linkable) — wilaya + online/offline price |
| `/site/promotions` | Public promotions with countdowns |
| `/site/contacts` | Socials + WhatsApp + embedded map |
| `/site/custom-order` | "Sur mesure" custom request |
| `/site/thank-you` | Animated confirmation with confetti |

## Notable details
- **MOOSING logotype** (`src/components/ui/Logo.tsx`): letter-by-letter reveal + animated gradient sweep + 3D float.
- **3D components** (`src/components/ui/3d-orbit-gallery.tsx`, `hero-futuristic.tsx`): WebGL-based, wrapped in a `ThreeErrorBoundary` + WebGPU/WebGL capability check so the page never breaks.
- **i18n** (`src/i18n/`): every string comes from `fr.ts` / `ar.ts`; switching to Arabic flips the whole layout to RTL.
- **Data + store** (`src/data/`, `src/store/StoreContext.tsx`): typed mock data, the 58 Algerian wilayas, and all CRUD operations. Backup exports JSON; Restore imports it.
- **Copy-link** on programs/promotions produces `/site/order/:id` deep links that open the order page pre-loaded.
