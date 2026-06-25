import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingCart, Wifi, Store, Tag, CalendarClock, Flame } from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/Countdown";
import { formatPrice } from "@/lib/utils";

export default function SitePromotions() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { data, categoryName } = useStore();

  const active = data.promotions.filter((p) => p.active);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <Badge tone="promo" className="mb-3">
          <Flame className="h-3.5 w-3.5" />
          {t("site.promo")}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text-secondary">
          {t("site.promotions")}
        </h1>
      </motion.div>

      {active.length === 0 ? (
        <div className="grid place-items-center py-24 text-center text-moo-muted">
          <div>
            <Tag className="h-12 w-12 mx-auto mb-3" />
            <p>{t("promotion.empty")}</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((p, i) => {
            const target = p.baseProgramId ?? p.id;
            const discount = Math.round(
              (1 - p.newPriceOnline / (p.priceOnline || 1)) * 100
            );
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08, type: "spring", stiffness: 240, damping: 24 }}
                className="h-full"
              >
                <GlassCard
                  hover
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/site/order/${target}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/site/order/${target}`);
                    }
                  }}
                  aria-label={p.name}
                  className="p-0 overflow-hidden h-full flex flex-col cursor-pointer group/card"
                >
                  <div className="aspect-video overflow-hidden relative group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover/card:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-moo-bg/90 to-transparent" />
                    <div className="absolute top-3 start-3 grid place-items-center h-14 w-14 rounded-full btn-gradient-secondary text-white font-bold text-sm shadow-lg">
                      -{discount}%
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <Badge tone="violet" className="self-start mb-2">
                      {categoryName(p.categoryId)}
                    </Badge>
                    <h3 className="font-display font-semibold text-moo-ink text-lg line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-sm text-moo-muted mt-1.5 line-clamp-2 flex-1">
                      {p.description}
                    </p>

                    {/* prices */}
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-moo-cyan" />
                        <span className="text-lg font-bold gradient-text-secondary">
                          {formatPrice(p.newPriceOnline, lang)}
                        </span>
                        <span className="text-xs text-moo-muted line-through">
                          {formatPrice(p.priceOnline, lang)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-moo-violet" />
                        <span className="text-sm font-semibold text-moo-ink">
                          {formatPrice(p.newPriceOffline, lang)}
                        </span>
                        <span className="text-xs text-moo-muted line-through">
                          {formatPrice(p.priceOffline, lang)}
                        </span>
                      </div>
                    </div>

                    {/* countdown */}
                    <div className="mt-4 rounded-xl glass p-3">
                      <p className="text-xs text-moo-muted flex items-center gap-1.5 mb-2">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {t("promotion.ends")}
                      </p>
                      <Countdown endDate={p.endDate} />
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/site/order/${target}`);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t("site.order")}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
