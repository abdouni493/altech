import { motion } from "framer-motion";

/**
 * Animated aurora / gradient-mesh blobs floating in the background.
 * Used on login + landing pages.
 */
export function Aurora({ dense = false }: { dense?: boolean }) {
  const blobs = [
    { c: "#7C3AED", x: "8%", y: "12%", s: 420, d: 0 },
    { c: "#06B6D4", x: "78%", y: "8%", s: 360, d: 2 },
    { c: "#EC4899", x: "70%", y: "72%", s: 400, d: 4 },
    { c: "#2563EB", x: "12%", y: "78%", s: 380, d: 1 },
    ...(dense
      ? [{ c: "#F97316", x: "45%", y: "40%", s: 300, d: 3 }]
      : []),
  ];
  return (
    <div className="aurora-bg pointer-events-none">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="aurora-blob"
          style={{
            background: b.c,
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 16 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.d,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0A0F_95%)]" />
    </div>
  );
}
