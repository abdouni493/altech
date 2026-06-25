import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Music2,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

export default function SiteContacts() {
  const { t } = useTranslation();
  const { data } = useStore();
  const { contacts, showroom } = data;

  const waNumber = showroom.phone.replace(/[^0-9]/g, "");

  const socials = [
    {
      label: "Facebook",
      icon: Facebook,
      url: contacts.facebookUrl,
      grad: "from-[#1877F2] to-[#0a5dc2]",
    },
    {
      label: "Instagram",
      icon: Instagram,
      url: contacts.instagramUrl,
      grad: "from-[#EC4899] to-[#F97316]",
    },
    {
      label: "TikTok",
      icon: Music2,
      url: contacts.tiktokUrl,
      grad: "from-[#06B6D4] to-[#0a0a0f]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">
          {t("site.contactsTitle")}
        </h1>
        <p className="text-moo-muted mt-2">{t("site.contactsSubtitle")}</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* left: socials + info */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {socials.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <GlassCard className="text-center py-6">
                    <span
                      className={`inline-grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br ${s.grad} text-white mb-2`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="text-sm font-medium text-moo-ink">{s.label}</p>
                  </GlassCard>
                </motion.a>
              );
            })}
          </div>

          <GlassCard>
            <div className="space-y-3">
              <ContactRow icon={Mail} label={showroom.email} />
              <ContactRow icon={Phone} label={showroom.phone} ltr />
              <ContactRow icon={MapPin} label={showroom.address} />
            </div>
          </GlassCard>

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <Button variant="success" size="lg" className="w-full">
              <MessageCircle className="h-5 w-5" />
              {t("site.chatWhatsapp")}
            </Button>
          </a>
        </div>

        {/* right: map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-2 h-full min-h-[360px]">
            <iframe
              title="map"
              src={contacts.mapsUrl}
              className="w-full h-full min-h-[340px] rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  ltr,
}: {
  icon: typeof Mail;
  label: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid place-items-center h-10 w-10 rounded-xl glass text-moo-cyan shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm text-moo-ink" dir={ltr ? "ltr" : undefined}>
        {label}
      </span>
    </div>
  );
}
