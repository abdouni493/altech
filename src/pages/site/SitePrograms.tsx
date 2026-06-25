import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX } from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { Input } from "@/components/ui/Field";
import { ProgramCard } from "@/components/site/ProgramCard";
import { cn } from "@/lib/utils";

export default function SitePrograms() {
  const { t } = useTranslation();
  const { data } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.programs.filter((p) => {
      const matchCat = cat === "all" || p.categoryId === cat;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat, data.programs]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">
          {t("site.allPrograms")}
        </h1>
      </motion.div>

      {/* search + filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
          <Input
            className="ps-10"
            placeholder={t("site.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            {t("common.all")}
          </FilterChip>
          {data.categories.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center py-24 text-center text-moo-muted">
          <div>
            <SearchX className="h-12 w-12 mx-auto mb-3" />
            <p>{t("site.noResults")}</p>
          </div>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p.id} layout exit={{ opacity: 0, scale: 0.9 }}>
                <ProgramCard program={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "btn-gradient text-white"
          : "glass text-moo-muted hover:text-moo-ink"
      )}
    >
      {children}
    </button>
  );
}
