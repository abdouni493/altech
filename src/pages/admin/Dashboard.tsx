import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Package,
  Percent,
  Tag,
  Layers,
  ShoppingCart,
  Wand2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Wifi,
  Store,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useStore } from "@/store/StoreContext";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { StatCounter } from "@/components/ui/StatCounter";
import { formatPrice, formatDate } from "@/lib/utils";

const STAT_META = [
  { key: "totalPrograms", icon: Package, grad: "from-moo-violet to-moo-blue" },
  { key: "totalPromotions", icon: Percent, grad: "from-moo-magenta to-moo-orange" },
  { key: "activePromotions", icon: Tag, grad: "from-moo-cyan to-moo-blue" },
  { key: "totalCategories", icon: Layers, grad: "from-moo-violet to-moo-cyan" },
  { key: "totalCommands", icon: ShoppingCart, grad: "from-moo-emerald to-moo-emerald2" },
  { key: "customOrders", icon: Wand2, grad: "from-moo-orange to-moo-rose" },
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { data, categoryName } = useStore();
  const lang = i18n.language;

  const stats = useMemo(() => {
    const pending = data.commands.filter((c) => c.status === "pending").length;
    const accepted = data.commands.filter((c) => c.status === "accepted");
    const cancelled = data.commands.filter((c) => c.status === "cancelled").length;
    const revenueOnline = accepted
      .filter((c) => c.type === "online")
      .reduce((s, c) => s + c.price, 0);
    const revenueOffline = accepted
      .filter((c) => c.type === "offline")
      .reduce((s, c) => s + c.price, 0);
    return {
      totalPrograms: data.programs.length,
      totalPromotions: data.promotions.length,
      activePromotions: data.promotions.filter((p) => p.active).length,
      totalCategories: data.categories.length,
      totalCommands: data.commands.length,
      customOrders: data.customOrders.length,
      pending,
      accepted: accepted.length,
      cancelled,
      revenueOnline,
      revenueOffline,
      revenueTotal: revenueOnline + revenueOffline,
    };
  }, [data]);

  const donut = [
    { name: t("dashboard.pending"), value: stats.pending, color: "#F59E0B" },
    { name: t("dashboard.accepted"), value: stats.accepted, color: "#10B981" },
    { name: t("dashboard.cancelled"), value: stats.cancelled, color: "#F43F5E" },
  ];

  const byCategory = useMemo(
    () =>
      data.categories
        .map((c) => ({
          name: c.name,
          value: data.programs.filter((p) => p.categoryId === c.id).length,
        }))
        .filter((x) => x.value > 0)
        .sort((a, b) => b.value - a.value),
    [data]
  );

  const recentCommands = data.commands.slice(0, 5);
  const newestPrograms = data.programs.slice(0, 4);

  return (
    <div>
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_META.map((m, i) => {
          const Icon = m.icon;
          const value = stats[m.key as keyof typeof stats] as number;
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 24 }}
            >
              <GlassCard hover className="h-full">
                <div
                  className={`inline-grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br ${m.grad} text-white mb-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold font-display text-moo-ink">
                  <StatCounter value={value} />
                </div>
                <div className="text-xs text-moo-muted mt-1">
                  {t(`dashboard.${m.key}`)}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Commands breakdown donut */}
        <GlassCard className="lg:col-span-1">
          <h3 className="font-display font-semibold text-moo-ink mb-1">
            {t("dashboard.commandsBreakdown")}
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                >
                  {donut.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#12121C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#F8FAFC",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { l: t("dashboard.pending"), v: stats.pending, icon: Clock, tone: "pending" as const },
              { l: t("dashboard.accepted"), v: stats.accepted, icon: CheckCircle2, tone: "accepted" as const },
              { l: t("dashboard.cancelled"), v: stats.cancelled, icon: XCircle, tone: "cancelled" as const },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.l} className="text-center">
                  <Badge tone={s.tone} className="w-full justify-center">
                    <Icon className="h-3 w-3" />
                    {s.v}
                  </Badge>
                  <p className="text-[10px] text-moo-muted mt-1">{s.l}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Programs by category bar */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display font-semibold text-moo-ink mb-1">
            {t("dashboard.programsByCategory")}
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#12121C",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#F8FAFC",
                  }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Revenue + activity row */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Revenue */}
        <GlassCard glow className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-moo-emerald2" />
            <h3 className="font-display font-semibold text-moo-ink">
              {t("dashboard.estimatedRevenue")}
            </h3>
          </div>
          <div className="text-3xl font-bold font-display gradient-text-secondary">
            {formatPrice(stats.revenueTotal, lang)}
          </div>
          <p className="text-xs text-moo-muted mt-1">{t("dashboard.revenueHint")}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm text-moo-muted">
                <Wifi className="h-4 w-4 text-moo-cyan" />
                {t("dashboard.revenueOnline")}
              </span>
              <span className="font-semibold text-moo-ink text-sm tabular-nums">
                {formatPrice(stats.revenueOnline, lang)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm text-moo-muted">
                <Store className="h-4 w-4 text-moo-violet" />
                {t("dashboard.revenueOffline")}
              </span>
              <span className="font-semibold text-moo-ink text-sm tabular-nums">
                {formatPrice(stats.revenueOffline, lang)}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Recent commands */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display font-semibold text-moo-ink mb-3">
            {t("dashboard.recentCommands")}
          </h3>
          <div className="space-y-2">
            {recentCommands.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5"
              >
                <img
                  src={c.image}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-moo-ink truncate">
                    {c.clientName}
                  </p>
                  <p className="text-xs text-moo-muted truncate">
                    {c.programName}
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <Badge
                    tone={c.status}
                    pulse={c.status === "pending"}
                  >
                    {t(`dashboard.${c.status === "pending" ? "pending" : c.status === "accepted" ? "accepted" : "cancelled"}`)}
                  </Badge>
                  <p className="text-[10px] text-moo-muted mt-1">
                    {formatDate(c.createdAt, lang)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Newest programs */}
      <div className="mt-4">
        <GlassCard>
          <h3 className="font-display font-semibold text-moo-ink mb-3">
            {t("dashboard.newestPrograms")}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {newestPrograms.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden bg-white/5 group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-moo-ink truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge tone="violet">{categoryName(p.categoryId)}</Badge>
                    <span className="text-xs font-semibold text-moo-cyan tabular-nums">
                      {formatPrice(p.priceOnline, lang)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
