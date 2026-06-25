import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wand2,
  User,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { WILAYAS } from "@/data/wilayas";
import { Aurora } from "@/components/ui/Aurora";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";

export default function CustomOrderPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { addCustomOrder } = useStore();

  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomOrder({ clientName: name, phone, wilaya, description });
    setDone(true);
  };

  return (
    <div className="relative min-h-[80vh] grid place-items-center px-4 py-12 overflow-hidden mesh-bg">
      <Aurora />

      <div className="relative z-10 w-full max-w-xl">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <GlassCard glow className="text-center py-12">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                  className="inline-grid place-items-center h-20 w-20 rounded-full bg-gradient-to-br from-moo-emerald to-moo-emerald2 text-white mx-auto mb-5 glow-cyan"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold gradient-text mb-2">
                  {t("site.thankYouTitle")}
                </h2>
                <p className="text-moo-ink/90">{t("site.customThanks")}</p>
                <Button className="mt-6" onClick={() => setDone(false)} variant="outline">
                  <Sparkles className="h-4 w-4" />
                  {t("site.customOrder")}
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <GlassCard glow>
                <div className="text-center mb-6">
                  <span className="inline-grid place-items-center h-14 w-14 rounded-2xl btn-gradient-secondary text-white mb-3">
                    <Wand2 className="h-7 w-7" />
                  </span>
                  <h1 className="text-2xl font-display font-bold gradient-text">
                    {t("site.customTitle")}
                  </h1>
                  <p className="text-sm text-moo-muted mt-1">
                    {t("site.customSubtitle")}
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <Field label={t("site.fullName")} required>
                    <div className="relative">
                      <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                      <Input
                        required
                        className="ps-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                  <Field label={t("site.customDesc")} required>
                    <Textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("site.customDescPlaceholder")}
                      className="min-h-[130px]"
                    />
                  </Field>
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-5 w-5" />
                    {t("site.customSubmit")}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
