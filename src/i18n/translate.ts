import type { AppLocale } from "./types";
import { arMessages } from "./messages/ar";
import { enMessages } from "./messages/en";

const catalogs: Record<AppLocale, Record<string, string>> = {
  en: enMessages,
  ar: arMessages,
};

export type TranslateParams = Record<string, string | number>;

export function translate(
  locale: AppLocale,
  key: string,
  params?: TranslateParams,
): string {
  const template =
    catalogs[locale][key] ?? catalogs.en[key] ?? key.replace(/\./g, " ");
  if (!params) return template;
  return Object.entries(params).reduce(
    (text, [name, value]) =>
      text.replace(new RegExp(`\\{\\{${name}\\}\\}`, "g"), String(value)),
    template,
  );
}
