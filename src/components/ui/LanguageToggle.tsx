import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { setLanguage, type AppLang } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language as AppLang;

  const options: { code: AppLang; label: string; flag: string }[] = [
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "ar", label: "ع", flag: "🇩🇿" },
  ];

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 glass rounded-full p-1",
        className
      )}
    >
      <Languages className="h-4 w-4 text-moo-muted mx-1.5" />
      {options.map((opt) => {
        const active = current === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={cn(
              "relative z-10 px-3 py-1 rounded-full text-sm font-semibold transition-colors",
              active ? "text-white" : "text-moo-muted hover:text-moo-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full btn-gradient -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="me-1">{opt.flag}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
