import { useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteConfig, NavItem } from "../types";

interface NavbarProps {
  currentPath: string;
  onNavigate: (to: string) => void;
  pollsCount: number;
  siteConfig: SiteConfig;
}

export function Navbar({ currentPath, onNavigate, pollsCount, siteConfig }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getIcon = (name: string) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) return IconComponent;
    
    // Fallback based on name matches
    if (name === "Vote") return Icons.Vote;
    if (name === "BarChart3") return Icons.BarChart3;
    if (name === "Shield") return Icons.Shield;
    
    return Icons.HelpCircle;
  };

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = siteConfig.navItems || [];

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand Section */}
          <div 
            id="nav-brand"
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick("/")}
          >
            <div className={`w-9 h-9 rounded-xl ${siteConfig.primaryAccentColor || "bg-slate-900"} flex items-center justify-center text-white transition-all duration-300 shadow-sm`}>
              <Icons.Vote className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-slate-900 block text-base md:text-lg">
                {siteConfig.brandName}
              </span>
              <span className="font-mono text-[10px] text-slate-400 block -mt-1 font-semibold uppercase tracking-wider">
                {siteConfig.brandSub}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = getIcon(item.iconName);
              const isActive = currentPath === item.path;

              return (
                <button
                  id={`nav-link-${item.path.replace("/", "root")}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-slate-950 font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? siteConfig.accentTextColor || "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span>{item.label}</span>
                  {item.badgeText && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-widest border border-indigo-100/50">
                      {item.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-inner"
          >
            <div className="px-3 py-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = getIcon(item.iconName);
                const isActive = currentPath === item.path;

                return (
                  <button
                    id={`mobile-nav-link-${item.path.replace("/", "root")}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeText ? (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                      }`}>
                        {item.badgeText}
                      </span>
                    ) : (
                      pollsCount > 0 && item.path === "/" && (
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                          isActive ? "bg-white text-slate-900" : "bg-slate-100 text-slate-600"
                        }`}>
                          {pollsCount}
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
