import { useState } from "react";
import {
  Link,
  NavLink,
  useOutlet,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShieldCheck, Sparkles } from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { SiteBackground } from "@/components/site/SiteBackground";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/site", key: "home", end: true },
  { to: "/site/programs", key: "programs", end: false },
  { to: "/site/promotions", key: "promotions", end: false },
  { to: "/site/contacts", key: "contacts", end: false },
  { to: "/site/custom-order", key: "customOrder", end: false },
];

export function PublicLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { data } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const outlet = useOutlet();

  return (
    <div className="relative min-h-dvh w-full text-moo-ink flex flex-col">
      {/* Site-wide animated 3D programming background */}
      <SiteBackground />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 py-3 flex items-center justify-between gap-4">
          <Link to="/site">
            <Logo size="sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-moo-muted hover:text-moo-ink"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="site-nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t(`site.${l.key}`)}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />
            <Link to="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                <ShieldCheck className="h-4 w-4" />
                {t("site.adminLogin")}
              </Button>
            </Link>
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="lg:hidden grid place-items-center h-10 w-10 rounded-lg glass text-moo-ink"
              aria-label="menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1.5">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block px-4 py-3 rounded-xl text-sm font-medium",
                        isActive
                          ? "btn-gradient text-white"
                          : "text-moo-muted hover:bg-white/5"
                      )
                    }
                  >
                    {t(`site.${l.key}`)}
                  </NavLink>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <LanguageToggle />
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm">
                      <ShieldCheck className="h-4 w-4" />
                      {t("site.adminLogin")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content — keyed by path so each route mounts cleanly (see PageTransition) */}
      <main className="flex-1">
        <PageTransition key={location.pathname}>{outlet}</PageTransition>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 glass-strong mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <Logo size="sm" />
            <p className="text-sm text-moo-muted mt-3 max-w-xs">
              {data.showroom.description}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-moo-ink mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-moo-cyan" />
              {t("site.programs")}
            </h4>
            <ul className="space-y-2 text-sm text-moo-muted">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-moo-ink transition">
                    {t(`site.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-moo-ink mb-3">
              {t("site.contacts")}
            </h4>
            <ul className="space-y-2 text-sm text-moo-muted">
              <li>{data.showroom.email}</li>
              <li dir="ltr">{data.showroom.phone}</li>
              <li>{data.showroom.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-moo-muted">
          © {new Date().getFullYear()}{" "}
          <span className="gradient-text font-semibold">{data.showroom.name}</span> —{" "}
          {t("site.footerRights")}
        </div>
      </footer>
    </div>
  );
}
