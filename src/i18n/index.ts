import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr } from "./fr";
import { ar } from "./ar";

export const LANG_STORAGE_KEY = "moosing-lang";

export type AppLang = "fr" | "ar";

const saved = (typeof localStorage !== "undefined" &&
  localStorage.getItem(LANG_STORAGE_KEY)) as AppLang | null;

const initialLang: AppLang = saved === "ar" || saved === "fr" ? saved : "fr";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export function applyDir(lang: AppLang) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const html = document.documentElement;
  html.setAttribute("dir", dir);
  html.setAttribute("lang", lang);
}

export function setLanguage(lang: AppLang) {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyDir(lang);
}

// apply on load
applyDir(initialLang);

export default i18n;
