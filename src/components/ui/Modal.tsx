import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
  /** Where the panel sits in the viewport. "top" anchors it near the top-middle. */
  position?: "center" | "top";
}

const SIZE = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = "lg",
  position = "center",
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[200] flex justify-center px-4 overflow-y-auto no-scrollbar",
            position === "top"
              ? "items-start py-[clamp(1rem,6vh,4.5rem)]"
              : "items-center py-4"
          )}
        >
          {/* scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: position === "top" ? -16 : 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: position === "top" ? -12 : 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "relative z-10 my-auto w-full glass-strong rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col",
              position === "top" && "my-0",
              SIZE[size],
              className
            )}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-semibold font-display gradient-text">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="grid place-items-center h-9 w-9 rounded-lg text-moo-muted hover:text-moo-ink hover:bg-white/10 transition"
                aria-label="close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 no-scrollbar">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
