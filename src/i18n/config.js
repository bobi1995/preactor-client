import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import homeBg from "./translations/bg/home.json";
import homeEn from "./translations/en/home.json";

import menuBg from "./translations/bg/menu.json";
import menuEn from "./translations/en/menu.json";

import resourceBg from "./translations/bg/resource.json";
import resourceEn from "./translations/en/resource.json";

import shiftBg from "./translations/bg/shift.json";
import shiftEn from "./translations/en/shift.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    //debug: true,
    resources: {
      en: {
        home: homeEn,
        menu: menuEn,
        resource: resourceEn,
        shift: shiftEn,
      },
      bg: {
        home: homeBg,
        menu: menuBg,
        resource: resourceBg,
        shift: shiftBg,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
