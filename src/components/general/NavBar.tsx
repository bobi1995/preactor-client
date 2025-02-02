import { useTranslation } from "react-i18next";

const isActiveLink = (path: string) => location.pathname === path;

const NavBar = () => {
  const { t, i18n } = useTranslation("menu");

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="sticky top-0 bg-gray-800 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-lg font-bold">MyApp</div>
        <nav className="space-x-4">
          <a
            href="/"
            className={`hover:underline ${
              isActiveLink("/") ? "text-green-500 font-bold" : ""
            }`}
          >
            {t("home")}
          </a>
          <a
            href="/resource"
            className={`hover:underline ${
              isActiveLink("/resource") ? "text-green-500 font-bold" : ""
            }`}
          >
            {t("resource")}
          </a>
          <a
            href="/group"
            className={`hover:underline ${
              isActiveLink("/group") ? "text-green-500 font-bold" : ""
            }`}
          >
            {t("group")}
          </a>
          <a
            href="/shift"
            className={`hover:underline ${
              isActiveLink("/shift") ? "text-green-500 font-bold" : ""
            }`}
          >
            {t("shift")}
          </a>
          <a
            href="/schedule"
            className={`hover:underline ${
              isActiveLink("/schedule") ? "text-green-500 font-bold" : ""
            }`}
          >
            {t("schedule")}
          </a>
        </nav>
        <div className="flex space-x-2">
          <button
            onClick={() => switchLanguage("en")}
            className={`px-3 py-1 rounded ${
              i18n.language === "en" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => switchLanguage("bg")}
            className={`px-3 py-1 rounded ${
              i18n.language === "bg" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            BG
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
