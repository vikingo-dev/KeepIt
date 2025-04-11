import { labels } from "./ui";
import { format } from "date-fns";
import { configSite } from "config";

const defaultLang = "es"
export function useTranslations(lang: keyof typeof labels) {
  return function translate(key: keyof typeof labels[typeof defaultLang]) {
    return labels[lang][key] || labels[defaultLang][key]
  }
}

export function generateTokenAI() {
  const today = format(new Date(), "yyyy-MM-dd");
  const tokenContent = `${configSite.name}${today}@vikingo-dev`;
  return btoa(tokenContent);
}