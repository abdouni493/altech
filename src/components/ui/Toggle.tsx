import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300 shrink-0",
          checked ? "btn-gradient" : "bg-white/15"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </span>
      {label && (
        <span className="text-sm text-moo-ink group-hover:text-white transition">
          {label}
        </span>
      )}
    </button>
  );
}
