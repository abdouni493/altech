import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Page enter animation.
 *
 * Intentionally enter-only (no `exit`) and NOT wrapped in `AnimatePresence`
 * with `mode="wait"`. The previous version gated the incoming page behind the
 * outgoing page's blur exit animation; when that exit failed to report
 * completion the next page never mounted and the content area stayed blank
 * until a full page refresh. Keying this component by the route path forces a
 * clean remount on navigation, so the new page always renders immediately.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 0.8, 0.2, 1] }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
