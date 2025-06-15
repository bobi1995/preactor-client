import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./translations/en.json";
import translationBG from "./translations/bg.json";

const resources = {
  en: {
    translation: translationEN,
  },
  bg: {
    translation: translationBG,
  },
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "bg", // Use English if detected language is not available
    debug: import.meta.env.DEV, // Enable debug output in development
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"], // Cache the selected language in localStorage
    },
  });

export default i18n;
