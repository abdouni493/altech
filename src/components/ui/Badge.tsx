import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "pending" | "accepted" | "cancelled" | "violet" | "cyan" | "promo" | "neutral";

const TONES: Record<Tone, string> = {
  pending: "bg-moo-amber/15 text-moo-amber border-moo-amber/30",
  accepted: "bg-moo-emerald/15 text-moo-emerald2 border-moo-emerald/30",
  cancelled: "bg-moo-rose/15 text-moo-rose border-moo-rose/30",
  violet: "bg-moo-violet/15 text-violet-300 border-moo-violet/30",
  cyan: "bg-moo-cyan/15 text-cyan-300 border-moo-cyan/30",
  promo: "bg-gradient-to-r from-moo-magenta/20 to-moo-orange/20 text-pink-200 border-moo-magenta/30",
  neutral: "bg-white/10 text-moo-muted border-white/15",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  pulse,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      {pulse && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}
