import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number, lang: string = "fr") {
  const formatted = new Intl.NumberFormat(
    lang === "ar" ? "ar-DZ" : "fr-DZ",
    { maximumFractionDigits: 0 }
  ).format(value);
  return `${formatted} DA`;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso: string, lang: string = "fr") {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : "fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
