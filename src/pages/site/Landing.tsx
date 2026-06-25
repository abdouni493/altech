import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag, Layers, Code2 } from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { HeroFuturistic } from "@/components/ui/hero-futuristic";
import { ThreeErrorBoundary } from "@/components/three/ErrorBoundary";
import { OrbitGallery } from "@/components/ui/3d-orbit-gallery";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ProgramCard } from "@/components/site/ProgramCard";

export default function Landing() {
  const { t } = useTranslation();
  const { data } = useStore();

  const featured = data.programs.slice(0, 6);
  const logo = (data.showroom.logo ?? "").trim();
  const brandInitial =
    (data.showroom.name ?? "").trim().charAt(0).toUpperCase() || "A";

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <ThreeErrorBoundary
          fallback={
            <div className="absolute inset-0">
              <OrbitGallery className="h-full w-full" interactive={false} />
            </div>
          }
        >
          <HeroFuturistic className="absolute inset-0">
            <></>
          </HeroFuturistic>
        </ThreeErrorBoundary>

        {/* gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-moo-bg/30 via-transparent to-moo-bg pointer-events-none" />

        {/* hero content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center">
          {/* Animated, glowing circular brand logo (from the database) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 18 }}
            className="relative mb-7 grid place-items-center"
          >
            {/* pulsing glow halo */}
            <motion.span
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 md:h-40 md:w-40 rounded-full btn-gradient blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* slow-rotating orbit ring */}
            <motion.span
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 md:h-36 md:w-36 rounded-full border-2 border-transparent border-t-moo-cyan/60 border-r-moo-violet/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            {/* floating logo disc */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid place-items-center h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden bg-moo-bg2 ring-2 ring-white/15 glow-violet"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={data.showroom.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="font-display font-extrabold text-4xl gradient-text">
                  {brandInitial}
                </span>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge tone="promo" className="mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {t("brand.subtitle")}
            </Badge>
          </motion.div>

          {/* Animated brand wordmark (showroom name from the database) */}
          <Logo size="xl" withMark={false} className="justify-center mb-5" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-2xl text-moo-ink/90 max-w-2xl text-balance"
          >
            {data.showroom.description || t("brand.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <Link to="/site/programs">
              <Button size="lg">
                <Code2 className="h-5 w-5" />
                {t("site.heroCta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/site/promotions">
              <Button size="lg" variant="secondary">
                <Tag className="h-5 w-5" />
                {t("site.heroCtaSecondary")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 h-10 w-6 rounded-full border-2 border-white/20 grid place-items-start p-1"
        >
          <span className="h-2 w-2 rounded-full bg-moo-cyan" />
        </motion.div>
      </section>

      {/* ABOUT showroom */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="gradient-text">{data.showroom.name}</span>
            </h2>
            <p className="text-moo-muted text-lg leading-relaxed">
              {data.showroom.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/site/programs">
                <Button>
                  {t("site.exploreAll")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/site/custom-order">
                <Button variant="outline">{t("site.customOrder")}</Button>
              </Link>
            </div>
          </motion.div>

          {/* categories chips */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-moo-cyan" />
                <h3 className="font-display font-semibold">{t("site.categories")}</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {data.categories.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to="/site/programs">
                      <span className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm text-moo-ink hover:btn-gradient hover:text-white transition cursor-pointer">
                        <Code2 className="h-3.5 w-3.5" />
                        {c.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* FEATURED programs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
              {t("site.featured")}
            </h2>
          </div>
          <Link to="/site/programs">
            <Button variant="outline" size="sm">
              {t("site.exploreAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <ProgramCard key={p.id} program={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
