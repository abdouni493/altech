import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Wifi, Store, ExternalLink, ArrowRight } from "lucide-react";

import type { Program } from "@/data/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/StoreContext";
import { formatPrice } from "@/lib/utils";

export function ProgramCard({ program, index = 0 }: { program: Program; index?: number }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { categoryName } = useStore();
  const lang = i18n.language;

  const goToDetails = () => navigate(`/site/order/${program.id}`);
  const hasDemo = program.demoUrlEnabled && !!program.demoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 4) * 0.08, type: "spring", stiffness: 240, damping: 24 }}
      className="h-full"
    >
      <GlassCard
        hover
        role="button"
        tabIndex={0}
        onClick={goToDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToDetails();
          }
        }}
        aria-label={program.name}
        className="p-0 overflow-hidden h-full flex flex-col cursor-pointer group/card"
      >
        <div className="aspect-video overflow-hidden relative group">
          <img
            src={program.image}
            alt={program.name}
            className="h-full w-full object-cover group-hover/card:scale-110 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-moo-bg/80 to-transparent" />
          {/* "view details" hint reveals on hover */}
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover/card:opacity-100 transition duration-300">
            <span className="inline-flex items-center gap-1.5 rounded-full glass-strong px-4 py-2 text-sm font-medium text-moo-ink">
              {t("site.viewDetails")}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          {hasDemo && (
            <Badge tone="cyan" className="absolute top-3 end-3">
              Demo
            </Badge>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <Badge tone="violet" className="self-start mb-2">
            {categoryName(program.categoryId)}
          </Badge>
          <h3 className="font-display font-semibold text-moo-ink text-lg line-clamp-1">
            {program.name}
          </h3>
          <p className="text-sm text-moo-muted mt-1.5 line-clamp-2 flex-1">
            {program.description}
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 text-moo-cyan font-semibold">
              <Wifi className="h-4 w-4" />
              {formatPrice(program.priceOnline, lang)}
            </span>
            <span className="flex items-center gap-1.5 text-moo-violet font-semibold">
              <Store className="h-4 w-4" />
              {formatPrice(program.priceOffline, lang)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                goToDetails();
              }}
            >
              {t("site.viewDetails")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            {hasDemo && (
              <a
                href={program.demoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={t("site.viewDemo")}
              >
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
