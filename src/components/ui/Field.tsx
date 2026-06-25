import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseField =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-moo-ink placeholder:text-moo-muted/70 outline-none transition focus:border-moo-violet/60 focus:ring-2 focus:ring-moo-violet/30 focus:bg-white/[0.07]";

export function Label({
  children,
  required,
  className,
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm font-medium text-moo-muted mb-1.5", className)}>
      {children}
      {required && <span className="text-moo-rose ml-1">*</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseField, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(baseField, "resize-y min-h-[110px]", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(baseField, "appearance-none cursor-pointer [&>option]:bg-moo-bg2", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-moo-muted/80">{hint}</p>}
    </div>
  );
}
