import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Wifi,
  Store,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { WILAYAS } from "@/data/wilayas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select } from "@/components/ui/Field";
import { formatPrice, cn } from "@/lib/utils";
import type { OrderType } from "@/data/types";

export default function OrderPage() {
  const { programId } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { data, getProgram, addCommand, categoryName } = useStore();

  // resolve program — fall back to a promotion with this id
  const resolved = useMemo(() => {
    const prog = programId ? getProgram(programId) : undefined;
    if (prog)
      return {
        id: prog.id,
        name: prog.name,
        description: prog.description,
        image: prog.image,
        priceOnline: prog.priceOnline,
        priceOffline: prog.priceOffline,
        categoryId: prog.categoryId,
        demoUrl: prog.demoUrlEnabled ? prog.demoUrl : "",
      };
    const promo = data.promotions.find(
      (p) => p.id === programId || p.baseProgramId === programId
    );
    if (promo)
      return {
        id: promo.baseProgramId ?? promo.id,
        name: promo.name,
        description: promo.description,
        image: promo.image,
        priceOnline: promo.newPriceOnline,
        priceOffline: promo.newPriceOffline,
        categoryId: promo.categoryId,
        demoUrl: promo.demoUrlEnabled ? promo.demoUrl : "",
      };
    return null;
  }, [programId, getProgram, data.promotions]);

  const [type, setType] = useState<OrderType>("online");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");

  if (!resolved) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-moo-muted mb-4">{t("site.noResults")}</p>
        <Link to="/site/programs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            {t("site.allPrograms")}
          </Button>
        </Link>
      </div>
    );
  }

  const price = type === "online" ? resolved.priceOnline : resolved.priceOffline;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommand({
      clientName: name,
      phone,
      wilaya,
      programId: resolved.id,
      type,
      price,
      image: resolved.image,
      programName: resolved.name,
    });
    navigate("/site/thank-you");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <Link to="/site/programs" className="inline-block mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          {t("site.allPrograms")}
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Program summary */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <GlassCard className="p-0 overflow-hidden sticky top-24">
            <div className="aspect-video overflow-hidden relative">
              <img
                src={resolved.image}
                alt={resolved.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-moo-bg to-transparent" />
              <Badge tone="violet" className="absolute bottom-3 start-3">
                {categoryName(resolved.categoryId)}
              </Badge>
            </div>
            <div className="p-6">
              <p className="text-xs text-moo-muted uppercase tracking-wide mb-1">
                {t("site.orderProgram")}
              </p>
              <h2 className="text-2xl font-display font-bold text-moo-ink">
                {resolved.name}
              </h2>
              <p className="text-sm text-moo-muted mt-2">{resolved.description}</p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-moo-cyan mb-1">
                    <Wifi className="h-3.5 w-3.5" /> {t("common.online")}
                  </span>
                  <span className="font-bold text-moo-ink tabular-nums">
                    {formatPrice(resolved.priceOnline, lang)}
                  </span>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-moo-violet mb-1">
                    <Store className="h-3.5 w-3.5" /> {t("common.offline")}
                  </span>
                  <span className="font-bold text-moo-ink tabular-nums">
                    {formatPrice(resolved.priceOffline, lang)}
                  </span>
                </div>
              </div>

              {resolved.demoUrl && (
                <a href={resolved.demoUrl} target="_blank" rel="noreferrer" className="block mt-3">
                  <Button variant="outline" className="w-full" size="sm">
                    <ExternalLink className="h-4 w-4" />
                    {t("programs.viewDemo")}
                  </Button>
                </a>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Order form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.05 }}
        >
          <GlassCard glow>
            <h2 className="text-xl font-display font-bold gradient-text mb-1">
              {t("site.orderTitle")}
            </h2>

            <form onSubmit={submit} className="space-y-5 mt-5">
              {/* type selector */}
              <div>
                <p className="text-sm font-medium text-moo-muted mb-2">
                  {t("site.chooseType")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["online", "offline"] as OrderType[]).map((opt) => {
                    const active = type === opt;
                    const Icon = opt === "online" ? Wifi : Store;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setType(opt)}
                        className={cn(
                          "relative rounded-xl border p-4 text-start transition",
                          active
                            ? "border-transparent btn-gradient text-white"
                            : "border-white/10 bg-white/5 text-moo-muted hover:border-white/25"
                        )}
                      >
                        <Icon className="h-5 w-5 mb-2" />
                        <p className="text-sm font-semibold">
                          {t(`common.${opt}`)}
                        </p>
                        <p className={cn("text-xs mt-0.5", active ? "text-white/90" : "text-moo-muted")}>
                          {formatPrice(
                            opt === "online" ? resolved.priceOnline : resolved.priceOffline,
                            lang
                          )}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label={t("site.fullName")} required>
                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                  <Input
                    required
                    className="ps-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </Field>

              <Field label={t("site.phone")} required>
                <div className="relative">
                  <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                  <Input
                    required
                    type="tel"
                    dir="ltr"
                    className="ps-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0xxx xx xx xx"
                    autoComplete="tel"
                  />
                </div>
              </Field>

              <Field label={t("site.wilaya")} required>
                <div className="relative">
                  <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted z-10" />
                  <Select
                    required
                    className="ps-10"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                  >
                    <option value="" disabled>
                      {t("site.selectWilaya")}
                    </option>
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={lang === "ar" ? w.ar : w.fr}>
                        {w.code} — {lang === "ar" ? w.ar : w.fr}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>

              {/* total */}
              <div className="flex items-center justify-between rounded-xl glass px-4 py-3">
                <span className="text-sm text-moo-muted">{t("common.price")}</span>
                <span className="text-xl font-bold gradient-text tabular-nums">
                  {formatPrice(price, lang)}
                </span>
              </div>

              <Button type="submit" size="lg" className="w-full">
                <ShoppingCart className="h-5 w-5" />
                {t("site.confirmOrder")}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
