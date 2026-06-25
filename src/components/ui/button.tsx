import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "gradient" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  gradient: "btn-gradient text-white shadow-lg",
  secondary: "btn-gradient-secondary text-white shadow-lg",
  outline:
    "border border-white/15 bg-white/5 text-moo-ink hover:bg-white/10 hover:border-white/30",
  ghost: "text-moo-muted hover:text-moo-ink hover:bg-white/5",
  danger: "bg-gradient-to-r from-moo-rose to-moo-magenta text-white shadow-lg",
  success:
    "bg-gradient-to-r from-moo-emerald to-moo-emerald2 text-white shadow-lg",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-xl gap-2.5 py-3.5",
  icon: "h-10 w-10 rounded-lg grid place-items-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gradient", size = "md", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-moo-bg transition-colors",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
