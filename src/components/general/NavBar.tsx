import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router"; // Import NavLink and useLocation

// A simple logo placeholder - you can replace this with your actual SVG or Image logo
const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/images/logo/logo.jpg" // Replace with your logo path
    alt="App Logo"
    className={`h-8 w-auto ${className || ""}`}
  />
);

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const navItems = [
    { path: "/", labelKey: "nav.home", exact: true },
    { path: "/resource", labelKey: "nav.resource" },
    { path: "/group", labelKey: "nav.group" },
    { path: "/shift", labelKey: "nav.shift" },
    { path: "/schedule", labelKey: "nav.schedule" },
  ];

  const languageOptions = [
    { code: "en", label: "EN" },
    { code: "bg", label: "BG" },
  ];

  return (
    <div className="sticky top-0 bg-white text-slate-800 shadow-sm border-b border-slate-200 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo / App Name */}
        <NavLink to="/" className="flex items-center space-x-2 text-indigo-600">
          <AppLogo className="h-7 w-auto text-indigo-600" />
          <span className="text-xl font-bold hidden sm:inline">
            OptiPlan AI
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
          {navItems.map((item) => (
            <NavLink
              key={item.labelKey}
              to={item.path}
              // `end` prop for NavLink in React Router v6 for exact matching for root paths
              // For older versions or more complex scenarios, you might need a custom active check.
              end={item.path === "/"}
              className={({ isActive }: any) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-semibold shadow-inner"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center space-x-1.5 p-0.5 bg-slate-100 rounded-lg ">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              title={
                t("common.switchTo", "Switch to {{language}}", {
                  // Assuming 'switchTo' is in 'common'
                  language: lang.label.toUpperCase(),
                }) || ""
              }
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                i18n.language.startsWith(lang.code)
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button (Placeholder - functionality not implemented here) */}
        <div className="md:hidden">
          <button className="p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">{t("openMenu", "Open main menu")}</span>
            {/* Hamburger Icon */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Panel (Placeholder - shown/hidden based on state) */}
      {/* <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.labelKey}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
        </div> */}
    </div>
  );
};

export default NavBar;
