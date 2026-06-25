import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function diff(end: string) {
  const ms = new Date(end).getTime() - Date.now();
  const clamped = Math.max(0, ms);
  return {
    expired: ms <= 0,
    d: Math.floor(clamped / 86400000),
    h: Math.floor((clamped % 86400000) / 3600000),
    m: Math.floor((clamped % 3600000) / 60000),
    s: Math.floor((clamped % 60000) / 1000),
  };
}

export function Countdown({
  endDate,
  className,
  compact = false,
}: {
  endDate: string;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const [time, setTime] = useState(() => diff(endDate));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (time.expired) {
    return (
      <span className={cn("text-xs font-semibold text-moo-rose", className)}>
        {t("promotion.expired")}
      </span>
    );
  }

  const cells = [
    { v: time.d, l: t("promotion.days") },
    { v: time.h, l: t("promotion.hours") },
    { v: time.m, l: t("promotion.minutes") },
    { v: time.s, l: t("promotion.seconds") },
  ];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {cells.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className={cn(
              "grid place-items-center rounded-lg glass font-mono font-bold tabular-nums text-moo-ink",
              compact ? "h-7 min-w-7 px-1 text-xs" : "h-10 min-w-10 px-1.5 text-sm"
            )}
          >
            {String(c.v).padStart(2, "0")}
            <span className="text-[9px] text-moo-muted font-normal -mt-0.5">
              {c.l}
            </span>
          </div>
          {i < cells.length - 1 && (
            <span className="text-moo-muted font-bold">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
