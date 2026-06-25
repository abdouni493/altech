import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Phone,
  MapPin,
  Wifi,
  Store,
  Check,
  X,
  Wand2,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import type { CommandStatus } from "@/data/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Filter = "all" | CommandStatus | "custom";

export default function Commands() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const toast = useToast();
  const { data, setCommandStatus, deleteCommand, deleteCustomOrder } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmCustomId, setConfirmCustomId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all" || filter === "custom") return data.commands;
    return data.commands.filter((c) => c.status === filter);
  }, [filter, data.commands]);

  const counts = useMemo(
    () => ({
      all: data.commands.length,
      pending: data.commands.filter((c) => c.status === "pending").length,
      accepted: data.commands.filter((c) => c.status === "accepted").length,
      cancelled: data.commands.filter((c) => c.status === "cancelled").length,
      custom: data.customOrders.length,
    }),
    [data]
  );

  const tabs: { id: Filter; label: string; icon: typeof Clock }[] = [
    { id: "all", label: t("commands.allCommands"), icon: ShoppingCart },
    { id: "pending", label: t("dashboard.pending"), icon: Clock },
    { id: "accepted", label: t("dashboard.accepted"), icon: CheckCircle2 },
    { id: "cancelled", label: t("dashboard.cancelled"), icon: XCircle },
    { id: "custom", label: t("commands.customOrders"), icon: Wand2 },
  ];

  const changeStatus = (id: string, status: CommandStatus) => {
    setCommandStatus(id, status);
    toast(t("commands.statusChanged"), "success");
  };

  return (
    <div>
      <PageHeader title={t("commands.title")} subtitle={t("commands.subtitle")} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 glass rounded-xl p-1 mb-5 w-fit">
        {tabs.map((tb) => {
          const Icon = tb.icon;
          const active = filter === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setFilter(tb.id)}
              className={cn(
                "relative px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                active ? "text-white" : "text-moo-muted hover:text-moo-ink"
              )}
            >
              {active && (
                <motion.span
                  layoutId="cmd-tab"
                  className="absolute inset-0 rounded-lg btn-gradient -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {tb.label}
              <span className="text-xs opacity-70">({counts[tb.id]})</span>
            </button>
          );
        })}
      </div>

      {/* Custom orders */}
      {filter === "custom" ? (
        data.customOrders.length === 0 ? (
          <EmptyState icon={Wand2} text={t("commands.emptyCustom")} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {data.customOrders.map((o, i) => (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="grid place-items-center h-9 w-9 rounded-lg btn-gradient-secondary text-white shrink-0">
                        <Wand2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-moo-ink text-sm truncate">{o.clientName}</p>
                        <p className="text-xs text-moo-muted">{formatDate(o.createdAt, lang)}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="danger"
                        onClick={() => setConfirmCustomId(o.id)}
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-moo-ink/90 mb-3">{o.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-moo-muted">
                      <span className="flex items-center gap-1" dir="ltr">
                        <Phone className="h-3.5 w-3.5" />
                        {o.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {o.wilaya}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState icon={ShoppingCart} text={t("commands.empty")} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 24 }}
              >
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
                  <div className="flex gap-3 p-4">
                    <img
                      src={c.image}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-moo-ink text-sm truncate">
                        {c.clientName}
                      </p>
                      <p className="text-xs text-moo-muted truncate">{c.programName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge tone={c.status} pulse={c.status === "pending"}>
                          {t(`dashboard.${c.status}`)}
                        </Badge>
                        <Badge tone={c.type === "online" ? "cyan" : "violet"}>
                          {c.type === "online" ? (
                            <Wifi className="h-3 w-3" />
                          ) : (
                            <Store className="h-3 w-3" />
                          )}
                          {t(`common.${c.type}`)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-3 grid grid-cols-2 gap-2 text-xs text-moo-muted border-t border-white/5 pt-3">
                    <span className="flex items-center gap-1.5" dir="ltr">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {c.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {c.wilaya}
                    </span>
                    <span className="col-span-2 text-moo-cyan font-semibold text-sm tabular-nums">
                      {formatPrice(c.price, lang)}
                    </span>
                  </div>

                  {/* status actions */}
                  <div className="mt-auto p-3 border-t border-white/5 flex gap-2">
                    {c.status === "pending" && (
                      <Button
                        size="sm"
                        variant="success"
                        className="flex-1"
                        onClick={() => changeStatus(c.id, "accepted")}
                      >
                        <Check className="h-4 w-4" />
                        {t("commands.markAccepted")}
                      </Button>
                    )}
                    {c.status === "accepted" && (
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => changeStatus(c.id, "cancelled")}
                      >
                        <X className="h-4 w-4" />
                        {t("commands.markCancelled")}
                      </Button>
                    )}
                    {c.status === "cancelled" && (
                      <span className="flex-1 text-center text-xs text-moo-muted py-2">
                        {t("dashboard.cancelled")}
                      </span>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setConfirmId(c.id)}
                      title={t("common.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirmations */}
      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        message={t("commands.deleteConfirm")}
        onConfirm={() => {
          if (confirmId) {
            deleteCommand(confirmId);
            toast(t("commands.deleted"), "success");
          }
        }}
      />
      <ConfirmDialog
        open={!!confirmCustomId}
        onClose={() => setConfirmCustomId(null)}
        message={t("commands.deleteCustomConfirm")}
        onConfirm={() => {
          if (confirmCustomId) {
            deleteCustomOrder(confirmCustomId);
            toast(t("commands.deleted"), "success");
          }
        }}
      />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof ShoppingCart;
  text: string;
}) {
  return (
    <GlassCard className="grid place-items-center py-20 text-center">
      <div>
        <Icon className="h-12 w-12 mx-auto text-moo-muted mb-3" />
        <p className="text-moo-muted">{text}</p>
      </div>
    </GlassCard>
  );
}
