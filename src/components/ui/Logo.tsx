import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withMark?: boolean;
  float?: boolean;
  /** Override the displayed text. Defaults to the store name (showroom.name). */
  text?: string;
}

const SIZES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl md:text-8xl",
};

/**
 * Animated store logotype (text = showroom name):
 * - letter-by-letter reveal
 * - continuous animated gradient sweep (.gradient-text)
 * - subtle 3D float
 */
export function Logo({
  className,
  size = "md",
  withMark = true,
  float = true,
  text,
}: LogoProps) {
  const { data } = useStore();
  const name = (text ?? data.showroom.name ?? "").trim() || "MOOSING";
  const letters = name.split("");
  return (
    <div
      className={cn("flex items-center gap-2 select-none", className)}
      aria-label={name}
    >
      {withMark && <LogoMark size={size} float={float} />}
      <motion.div
        key={name}
        className="flex"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        }}
        style={{ perspective: 600 }}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 14, rotateX: -90 },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: { type: "spring", stiffness: 320, damping: 20 },
              },
            }}
            className="inline-block"
          >
            <motion.span
              className={cn(
                "font-display font-extrabold tracking-tight inline-block",
                i < 2 ? "gradient-text-green" : "gradient-text-blue",
                SIZES[size]
              )}
              animate={float ? { y: [0, -3, 0] } : undefined}
              transition={
                float
                  ? {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.12,
                    }
                  : undefined
              }
            >
              {ch === " " ? " " : ch}
            </motion.span>
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

const MARK_SIZE = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

export function LogoMark({
  size = "md",
  float = true,
}: {
  size?: LogoProps["size"];
  float?: boolean;
}) {
  const { data } = useStore();
  const logo = (data.showroom.logo ?? "").trim();

  return (
    <motion.div
      className={cn(
        "relative grid place-items-center rounded-full overflow-hidden shrink-0",
        logo
          ? "bg-moo-bg2 ring-2 ring-white/15 glow-violet"
          : "btn-gradient glow-violet",
        MARK_SIZE[size ?? "md"]
      )}
      animate={float ? { y: [0, -4, 0] } : undefined}
      transition={
        float ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined
      }
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <svg viewBox="0 0 32 32" className="h-2/3 w-2/3" fill="none">
          <path
            d="M6 24V8l5 8 5-8M16 24V8l5 8 5-8v16"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.div>
  );
}
