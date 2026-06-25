import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Store,
  UserCog,
  Database,
  Save,
  Download,
  Upload,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  User,
  AtSign,
  Lock,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import type { MoosingData } from "@/data/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/button";
import { ImageInput } from "@/components/ui/ImageInput";
import { BUCKETS } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Section = "showroom" | "account" | "database";

export default function SettingsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    data,
    updateShowroom,
    updateAccount,
    backup,
    restore,
    resetData,
  } = useStore();
  const [section, setSection] = useState<Section>("showroom");

  // Re-sync local form state when the store hydrates from Supabase so the
  // "Informations du showroom" / "Informations du compte" fields show the live
  // data even if it arrives after this page mounts.
  const [showroom, setShowroom] = useState(data.showroom);
  const [account, setAccount] = useState(data.account);
  useEffect(() => setShowroom(data.showroom), [data.showroom]);
  useEffect(() => setAccount(data.account), [data.account]);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveShowroom = () => {
    updateShowroom(showroom);
    toast(t("settings.saved"), "success");
  };
  const saveAccount = () => {
    updateAccount(account);
    toast(t("settings.saved"), "success");
  };

  const handleRestore = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as MoosingData;
        restore(json);
        setShowroom(json.showroom);
        setAccount(json.account);
        toast(t("settings.restoreDone"), "success");
      } catch {
        toast(t("validation.required"), "error");
      }
    };
    reader.readAsText(file);
  };

  const sections: { id: Section; label: string; icon: typeof Store }[] = [
    { id: "showroom", label: t("settings.showroomInfo"), icon: Store },
    { id: "account", label: t("settings.accountInfo"), icon: UserCog },
    { id: "database", label: t("settings.database"), icon: Database },
  ];

  return (
    <div>
      <PageHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <div className="grid lg:grid-cols-[240px_1fr] gap-5">
        {/* Section nav */}
        <div className="flex lg:flex-col gap-1.5">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-start flex-1 lg:flex-none",
                  active ? "text-white" : "text-moo-muted hover:text-moo-ink"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="settings-nav"
                    className="absolute inset-0 rounded-xl btn-gradient glow-violet -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section content */}
        <div>
          <AnimatePresence mode="wait">
            {section === "showroom" && (
              <SectionWrap key="showroom">
                <GlassCard>
                  <div className="grid md:grid-cols-[200px_1fr] gap-5">
                    <div>
                      <label className="block text-sm font-medium text-moo-muted mb-1.5">
                        {t("settings.logo")}
                      </label>
                      <ImageInput
                        value={showroom.logo}
                        onChange={(v) => setShowroom({ ...showroom, logo: v })}
                        aspect="aspect-square"
                        bucket={BUCKETS.logos}
                        folder="logo"
                      />
                    </div>
                    <div className="space-y-4">
                      <Field label={t("websiteSettings.showroomName")}>
                        <Input
                          value={showroom.name}
                          onChange={(e) => setShowroom({ ...showroom, name: e.target.value })}
                        />
                      </Field>
                      <Field label={t("common.description")}>
                        <Textarea
                          value={showroom.description}
                          onChange={(e) =>
                            setShowroom({ ...showroom, description: e.target.value })
                          }
                        />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label={t("settings.email")}>
                          <div className="relative">
                            <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                            <Input
                              type="email"
                              className="ps-10"
                              value={showroom.email}
                              onChange={(e) => setShowroom({ ...showroom, email: e.target.value })}
                            />
                          </div>
                        </Field>
                        <Field label={t("settings.phone")}>
                          <div className="relative">
                            <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                            <Input
                              dir="ltr"
                              className="ps-10"
                              value={showroom.phone}
                              onChange={(e) => setShowroom({ ...showroom, phone: e.target.value })}
                            />
                          </div>
                        </Field>
                      </div>
                      <Field label={t("settings.address")}>
                        <div className="relative">
                          <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                          <Input
                            className="ps-10"
                            value={showroom.address}
                            onChange={(e) => setShowroom({ ...showroom, address: e.target.value })}
                          />
                        </div>
                      </Field>
                      <Button onClick={saveShowroom}>
                        <Save className="h-4 w-4" />
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </SectionWrap>
            )}

            {section === "account" && (
              <SectionWrap key="account">
                <GlassCard className="max-w-xl">
                  <div className="space-y-4">
                    <Field label={t("auth.fullName")}>
                      <div className="relative">
                        <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                        <Input
                          className="ps-10"
                          value={account.name}
                          onChange={(e) => setAccount({ ...account, name: e.target.value })}
                        />
                      </div>
                    </Field>
                    <Field label={t("auth.username")}>
                      <div className="relative">
                        <AtSign className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                        <Input
                          className="ps-10"
                          value={account.username}
                          onChange={(e) => setAccount({ ...account, username: e.target.value })}
                        />
                      </div>
                    </Field>
                    <Field label={t("auth.email")}>
                      <div className="relative">
                        <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                        <Input
                          type="email"
                          className="ps-10"
                          value={account.email}
                          onChange={(e) => setAccount({ ...account, email: e.target.value })}
                        />
                      </div>
                    </Field>
                    <Field label={t("auth.password")}>
                      <div className="relative">
                        <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                        <Input
                          type="text"
                          className="ps-10 font-mono"
                          value={account.password}
                          onChange={(e) => setAccount({ ...account, password: e.target.value })}
                        />
                      </div>
                    </Field>
                    <Button onClick={saveAccount}>
                      <Save className="h-4 w-4" />
                      {t("common.save")}
                    </Button>
                  </div>
                </GlassCard>
              </SectionWrap>
            )}

            {section === "database" && (
              <SectionWrap key="database">
                <div className="space-y-4">
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5 text-moo-cyan" />
                    <h3 className="font-display font-semibold text-moo-ink">
                      {t("settings.database")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { label: t("dashboard.totalPrograms"), value: data.programs.length },
                      { label: t("dashboard.totalPromotions"), value: data.promotions.length },
                      { label: t("dashboard.totalCategories"), value: data.categories.length },
                      { label: t("dashboard.totalCommands"), value: data.commands.length },
                      { label: t("dashboard.customOrders"), value: data.customOrders.length },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl bg-white/5 px-3 py-3 text-center"
                      >
                        <div className="text-2xl font-bold font-display text-moo-ink tabular-nums">
                          {s.value}
                        </div>
                        <div className="text-[11px] text-moo-muted mt-0.5 leading-tight">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <div className="grid sm:grid-cols-2 gap-4">
                  <GlassCard glow className="text-center py-8">
                    <span className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-moo-emerald to-moo-emerald2 text-white mb-4">
                      <Download className="h-7 w-7" />
                    </span>
                    <h3 className="font-display font-semibold text-moo-ink">
                      {t("settings.backup")}
                    </h3>
                    <p className="text-xs text-moo-muted mt-1 mb-4 px-4">
                      {t("settings.backupHint")}
                    </p>
                    <Button
                      variant="success"
                      onClick={() => {
                        backup();
                        toast(t("settings.backupDone"), "success");
                      }}
                    >
                      <Download className="h-4 w-4" />
                      {t("settings.backup")}
                    </Button>
                  </GlassCard>

                  <GlassCard className="text-center py-8">
                    <span className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-moo-violet to-moo-cyan text-white mb-4">
                      <Upload className="h-7 w-7" />
                    </span>
                    <h3 className="font-display font-semibold text-moo-ink">
                      {t("settings.restore")}
                    </h3>
                    <p className="text-xs text-moo-muted mt-1 mb-4 px-4">
                      {t("settings.restoreHint")}
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <Button onClick={() => fileRef.current?.click()}>
                        <Upload className="h-4 w-4" />
                        {t("settings.restore")}
                      </Button>
                      <button
                        onClick={() => {
                          resetData();
                          setShowroom(data.showroom);
                          toast(t("settings.restoreDone"), "info");
                        }}
                        className="text-xs text-moo-muted hover:text-moo-rose flex items-center gap-1 mt-1 transition"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/json"
                      hidden
                      onChange={(e) => handleRestore(e.target.files?.[0])}
                    />
                  </GlassCard>
                </div>
                </div>
              </SectionWrap>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SectionWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
