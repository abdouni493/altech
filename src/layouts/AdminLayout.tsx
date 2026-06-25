import { useState } from "react";
import {
  NavLink,
  useOutlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  Package,
  Percent,
  ShoppingCart,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { PageTransition } from "@/components/PageTransition";
import { Aurora } from "@/components/ui/Aurora";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: LucideIcon;
  key: string;
}

const NAV: NavItem[] = [
  { to: "/admin/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/admin/website-settings", icon: Globe, key: "websiteSettings" },
  { to: "/admin/programs", icon: Package, key: "programs" },
  { to: "/admin/promotion", icon: Percent, key: "promotion" },
  { to: "/admin/commands", icon: ShoppingCart, key: "commands" },
  { to: "/admin/settings", icon: Settings, key: "settings" },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const outlet = useOutlet();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-dvh w-full bg-moo-bg text-moo-ink flex">
      <div className="fixed inset-0 mesh-bg opacity-60 pointer-events-none" />
      <Aurora />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative z-30 shrink-0 h-dvh sticky top-0 glass-strong border-e border-white/10 flex flex-col"
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-5 border-b border-white/10 overflow-hidden">
          {collapsed ? (
            <LogoMark size="md" />
          ) : (
            <Logo size="sm" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto no-scrollbar">
          {NAV.map((item, i) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
              >
                <NavLink
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors group",
                    active ? "text-white" : "text-moo-muted hover:text-moo-ink"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-active-pill"
                      className="absolute inset-0 rounded-xl btn-gradient glow-violet -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 grid place-items-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  {!collapsed && (
                    <span className="relative z-10 whitespace-nowrap">
                      {t(`nav.${item.key}`)}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-moo-muted hover:text-white hover:bg-moo-rose/15 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("nav.logout")}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="relative z-20 flex-1 min-w-0 flex flex-col h-dvh">
        {/* Topbar */}
        <header className="h-20 shrink-0 flex items-center justify-between gap-4 px-5 md:px-8 border-b border-white/10 glass-strong">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="grid place-items-center h-10 w-10 rounded-xl glass text-moo-muted hover:text-moo-ink transition"
            aria-label="toggle sidebar"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-moo-muted">
              {t("nav.backOffice")}
            </span>
            <LanguageToggle />
          </div>
        </header>

        {/* Content — keyed by path so each route mounts cleanly (see PageTransition) */}
        <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6">
          <PageTransition key={location.pathname}>{outlet}</PageTransition>
        </main>
      </div>
    </div>
  );
}
