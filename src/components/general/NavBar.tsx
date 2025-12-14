// src/components/general/NavBar.tsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router"; // Using 'react-router'
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Home,
  Factory,
  CalendarClock,
  ChevronDown,
  Warehouse,
  Users,
  Clock,
  Coffee,
  CalendarDays,
  Menu,
  X,
  ArrowLeftRight,
  Tag,
  Layers,
  Grid3X3,
} from "lucide-react";

const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/images/logo/logo.jpg"
    alt="App Logo"
    className={`h-8 w-auto ${className || ""}`}
  />
);

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

// FIX: Rewritten using a standard function declaration inside forwardRef
// This is a more robust syntax that avoids parsing issues with complex types.
const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  function NavItem({ to, icon: Icon, label, onClick }, ref) {
    return (
      <NavLink
        ref={ref}
        to={to}
        end={to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
              ? "bg-indigo-100 text-indigo-700 font-semibold shadow-inner"
              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`
        }
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </NavLink>
    );
  }
);

const NavDropdown: React.FC<{
  triggerLabel: string;
  triggerIcon: React.ElementType;
  items: any[];
  onClick?: () => void;
}> = ({ triggerLabel, triggerIcon: Icon, items, onClick }) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <Icon className="h-5 w-5" />
          <span>{triggerLabel}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="w-48 bg-white rounded-md shadow-lg border border-slate-200 p-1 z-50 animate-in fade-in-0 zoom-in-95"
        >
          {items.map((item) => (
            <DropdownMenu.Item key={item.path} asChild>
              <NavItem
                to={item.path}
                icon={item.icon}
                label={t(item.labelKey)}
                onClick={onClick}
              />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const switchLanguage = (lang: string) => i18n.changeLanguage(lang);

  const factoryItems = [
    { path: "/resource", labelKey: "nav.resource", icon: Warehouse },
    { path: "/group", labelKey: "nav.group", icon: Users },
  ];

  const planningItems = [
    { path: "/shift", labelKey: "nav.shift", icon: Clock },
    { path: "/breaks", labelKey: "nav.break", icon: Coffee },
    { path: "/schedule", labelKey: "nav.schedule", icon: CalendarDays },
  ];

  const changeoverItems = [
    { path: "/attributes", labelKey: "nav.attributes", icon: Tag },
    {
      path: "/changeover-groups",
      labelKey: "nav.changeoverGroups",
      icon: Layers,
    },
  ];

  const languageOptions = [
    { code: "en", label: "EN" },
    { code: "bg", label: "BG" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-200 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <NavLink to="/" className="flex items-center space-x-2 text-indigo-600">
          <AppLogo className="h-7 w-auto" />
          <span className="text-xl font-bold hidden sm:inline">
            OptiPlan AI
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center space-x-1">
          <NavItem to="/" icon={Home} label={t("nav.home")} />
          <NavDropdown
            triggerLabel={t("nav.factory")}
            triggerIcon={Factory}
            items={factoryItems}
          />
          <NavDropdown
            triggerLabel={t("nav.planning")}
            triggerIcon={CalendarClock}
            items={planningItems}
          />
          <NavDropdown
            triggerLabel={t("nav.changeovers")}
            triggerIcon={ArrowLeftRight}
            items={changeoverItems}
          />
        </nav>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 p-0.5 bg-slate-100 rounded-lg">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                title={t("common.switchTo", {
                  language: lang.label.toUpperCase(),
                })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 ${
                  i18n.language.startsWith(lang.code)
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-white hover:text-indigo-600"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-indigo-600"
            >
              <span className="sr-only">{t("nav.openMenu")}</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 fade-in-75">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200">
            <NavItem
              to="/"
              icon={Home}
              label={t("nav.home")}
              onClick={closeMobileMenu}
            />
            <div className="pl-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider my-2 flex items-center gap-2">
                <Factory size={14} /> {t("nav.factory")}
              </h3>
              {factoryItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
            <div className="pl-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider my-2 flex items-center gap-2">
                <CalendarClock size={14} /> {t("nav.planning")}
              </h3>
              {planningItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
            <div className="pl-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider my-2 flex items-center gap-2">
                <ArrowLeftRight size={14} /> {t("nav.changeovers")}
              </h3>
              {changeoverItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  onClick={closeMobileMenu}
                />
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
