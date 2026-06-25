import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-moo-muted mt-1">{subtitle}</p>
        )}
      </motion.div>
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
