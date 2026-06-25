import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Home, PhoneCall } from "lucide-react";

import { Aurora } from "@/components/ui/Aurora";
import { Button } from "@/components/ui/button";

const CONFETTI = Array.from({ length: 36 });
const COLORS = ["#7C3AED", "#2563EB", "#06B6D4", "#EC4899", "#F97316", "#10B981"];

export default function ThankYou() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[80vh] grid place-items-center px-4 overflow-hidden mesh-bg">
      <Aurora dense />

      {/* confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.6;
          const duration = 2.4 + Math.random() * 1.6;
          const color = COLORS[i % COLORS.length];
          const size = 6 + Math.random() * 8;
          return (
            <motion.span
              key={i}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{ y: "100vh", opacity: [0, 1, 1, 0], rotate: 360 }}
              transition={{ duration, delay, repeat: Infinity, ease: "easeIn" }}
              style={{
                position: "absolute",
                left: `${left}%`,
                width: size,
                height: size * 1.6,
                background: color,
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative z-10 text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
          className="inline-grid place-items-center h-24 w-24 rounded-full bg-gradient-to-br from-moo-emerald to-moo-emerald2 text-white mx-auto mb-6 glow-cyan"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
          {t("site.thankYouTitle")}
        </h1>
        <p className="text-lg text-moo-ink/90 flex items-center justify-center gap-2 mb-8">
          <PhoneCall className="h-5 w-5 text-moo-cyan" />
          {t("site.thankYouMsg")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/site">
            <Button size="lg">
              <Home className="h-5 w-5" />
              {t("site.backHome")}
            </Button>
          </Link>
          <Link to="/site/programs">
            <Button size="lg" variant="outline">
              {t("site.allPrograms")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
