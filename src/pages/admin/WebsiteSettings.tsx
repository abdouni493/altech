import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Music2,
  MapPin,
  Phone,
  Save,
  Contact,
  Settings2,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/button";
import { ImageInput } from "@/components/ui/ImageInput";
import { BUCKETS } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Tab = "contacts" | "site";

export default function WebsiteSettings() {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, updateContacts, updateShowroom } = useStore();
  const [tab, setTab] = useState<Tab>("contacts");

  // local form state — re-synced whenever the store hydrates from Supabase so the
  // fields fill in even if the data arrives after this page mounts.
  const [contacts, setContacts] = useState(data.contacts);
  const [showroom, setShowroom] = useState(data.showroom);
  useEffect(() => setContacts(data.contacts), [data.contacts]);
  useEffect(() => setShowroom(data.showroom), [data.showroom]);

  const saveContacts = () => {
    updateContacts(contacts);
    toast(t("websiteSettings.saved"), "success");
  };
  const saveSite = () => {
    updateShowroom({
      logo: showroom.logo,
      name: showroom.name,
      description: showroom.description,
    });
    toast(t("websiteSettings.saved"), "success");
  };

  const tabs: { id: Tab; label: string; icon: typeof Contact }[] = [
    { id: "contacts", label: t("websiteSettings.contactsTab"), icon: Contact },
    { id: "site", label: t("websiteSettings.siteTab"), icon: Settings2 },
  ];

  return (
    <div>
      <PageHeader
        title={t("websiteSettings.title")}
        subtitle={t("websiteSettings.subtitle")}
      />

      {/* Tabs */}
      <div className="inline-flex gap-1 glass rounded-xl p-1 mb-5">
        {tabs.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                active ? "text-white" : "text-moo-muted hover:text-moo-ink"
              )}
            >
              {active && (
                <motion.span
                  layoutId="ws-tab"
                  className="absolute inset-0 rounded-lg btn-gradient -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {tb.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "contacts" ? (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="max-w-2xl">
              <div className="space-y-4">
                <Field label={t("websiteSettings.facebook")}>
                  <div className="relative">
                    <Facebook className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      className="ps-10"
                      value={contacts.facebookUrl}
                      onChange={(e) =>
                        setContacts({ ...contacts, facebookUrl: e.target.value })
                      }
                    />
                  </div>
                </Field>
                <Field label={t("websiteSettings.instagram")}>
                  <div className="relative">
                    <Instagram className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      className="ps-10"
                      value={contacts.instagramUrl}
                      onChange={(e) =>
                        setContacts({ ...contacts, instagramUrl: e.target.value })
                      }
                    />
                  </div>
                </Field>
                <Field label={t("websiteSettings.tiktok")}>
                  <div className="relative">
                    <Music2 className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      className="ps-10"
                      value={contacts.tiktokUrl}
                      onChange={(e) =>
                        setContacts({ ...contacts, tiktokUrl: e.target.value })
                      }
                    />
                  </div>
                </Field>
                <Field label={t("websiteSettings.maps")}>
                  <div className="relative">
                    <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      className="ps-10"
                      value={contacts.mapsUrl}
                      onChange={(e) =>
                        setContacts({ ...contacts, mapsUrl: e.target.value })
                      }
                    />
                  </div>
                </Field>
                <Field
                  label={t("websiteSettings.whatsapp")}
                  hint={t("websiteSettings.whatsappHint")}
                >
                  <div className="relative">
                    <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      dir="ltr"
                      className="ps-10 opacity-80"
                      value={data.showroom.phone}
                      readOnly
                    />
                  </div>
                </Field>
                <div className="pt-2">
                  <Button onClick={saveContacts}>
                    <Save className="h-4 w-4" />
                    {t("common.save")}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="site"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="max-w-2xl">
              <div className="grid md:grid-cols-[200px_1fr] gap-5">
                <div>
                  <label className="block text-sm font-medium text-moo-muted mb-1.5">
                    {t("websiteSettings.logo")}
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
                      onChange={(e) =>
                        setShowroom({ ...showroom, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("websiteSettings.showroomDesc")}>
                    <Textarea
                      value={showroom.description}
                      onChange={(e) =>
                        setShowroom({ ...showroom, description: e.target.value })
                      }
                    />
                  </Field>
                  <Button onClick={saveSite}>
                    <Save className="h-4 w-4" />
                    {t("common.save")}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
