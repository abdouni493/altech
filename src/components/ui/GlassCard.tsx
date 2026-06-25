import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: boolean;
  gradientBorder?: boolean;
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, glow, gradientBorder = true, hover, children, ...props },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-2xl p-5",
          gradientBorder ? "gradient-border" : "glass-strong",
          glow && "glow-violet",
          hover && "card-hover hover:-translate-y-1.5 hover:glow-cyan",
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children as ReactNode}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
