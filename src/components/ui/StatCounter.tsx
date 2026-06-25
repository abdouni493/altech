import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/** Count-up animated number. */
export function StatCounter({
  value,
  duration = 1.2,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span className={className}>
      {new Intl.NumberFormat("fr-FR").format(display)}
    </span>
  );
}
