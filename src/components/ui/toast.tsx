import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { uid } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}
const Ctx = createContext<ToastCtx | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};
const ACCENT = {
  success: "from-moo-emerald to-moo-emerald2",
  error: "from-moo-rose to-moo-magenta",
  info: "from-moo-violet to-moo-cyan",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="fixed top-5 inset-x-0 z-[1000] flex flex-col items-center gap-2 px-4 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="pointer-events-auto glass-strong rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl min-w-[260px] max-w-sm"
              >
                <span
                  className={`grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br ${ACCENT[t.type]} text-white shrink-0`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm text-moo-ink flex-1">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-moo-muted hover:text-moo-ink transition"
                  aria-label="close"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
