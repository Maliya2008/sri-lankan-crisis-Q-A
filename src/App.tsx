/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Vote, Shield, BarChart3, ChevronRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { PollsList } from "./components/PollsList";
import { GlobalStats } from "./components/GlobalStats";
import { AdminPanel } from "./components/AdminPanel";
import { 
  getStoredPolls, 
  savePolls, 
  getUserVotes, 
  recordUserVote, 
  getStoredSiteConfig, 
  saveSiteConfig 
} from "./data";
import { Poll, SiteConfig } from "./types";

export default function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string }>({});
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(getStoredSiteConfig());
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Load state on mount
  useEffect(() => {
    setPolls(getStoredPolls());
    setUserVotes(getUserVotes());
    setSiteConfig(getStoredSiteConfig());
  }, []);

  // Listen to browser navigation changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Soft navigation trigger
  const handleNavigate = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Vote register event
  const handleVote = (pollId: string, optionId: string) => {
    const updatedPolls = polls.map((p) => {
      if (p.id === pollId) {
        return {
          ...p,
          options: p.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          }),
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);
    recordUserVote(pollId, optionId);
    setUserVotes(getUserVotes());
  };

  // Vote removal event
  const handleClearVote = (pollId: string) => {
    const previousVoteId = userVotes[pollId];
    if (!previousVoteId) return;

    // Remove one count from the previous voted option
    const updatedPolls = polls.map((p) => {
      if (p.id === pollId) {
        return {
          ...p,
          options: p.options.map((opt) => {
            if (opt.id === previousVoteId) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          }),
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    savePolls(updatedPolls);

    // Save empty registration in user record
    const updatedUserVotes = { ...userVotes };
    delete updatedUserVotes[pollId];
    localStorage.setItem("simple_polls_user_votes", JSON.stringify(updatedUserVotes));
    setUserVotes(updatedUserVotes);
  };

  // Admin save updated polls list
  const handleSavePolls = (updatedList: Poll[]) => {
    setPolls(updatedList);
    savePolls(updatedList);
  };

  // Admin save dynamic site configuration (menubars, branding, layout titles)
  const handleSaveSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    saveSiteConfig(newConfig);
  };

  // Admin global reset of scores
  const handleResetVotes = (pollId: string | null) => {
    const updated = polls.map((p) => {
      if (pollId === null || p.id === pollId) {
        return {
          ...p,
          options: p.options.map((opt) => ({ ...opt, votes: 0 })),
        };
      }
      return p;
    });

    setPolls(updated);
    savePolls(updated);
    
    // If resetting all, clear user browser voting records
    if (pollId === null) {
      localStorage.removeItem("simple_polls_user_votes");
      setUserVotes({});
    }
  };

  // Select proper main panel content based on current URL path
  const renderContent = () => {
    switch (currentPath) {
      case "/admin":
        return (
          <AdminPanel 
            polls={polls} 
            onSavePolls={handleSavePolls} 
            onResetVotes={handleResetVotes}
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
          />
        );
      case "/stats":
        return <GlobalStats polls={polls} />;
      default:
        // Render current custom tabs or list polls
        return (
          <PollsList
            polls={polls}
            userVotes={userVotes}
            onVote={handleVote}
            onClearVote={handleClearVote}
          />
        );
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-indigo-150 selection:text-indigo-900 leading-normal antialiased text-slate-800">
      
      {/* MINIMALIST HEADER & NAVIGATION */}
      <Navbar 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        pollsCount={polls.length} 
        siteConfig={siteConfig}
      />

      {/* DYNAMIC VIEW ROUTER CONTAINER */}
      <main id="app-main-content" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Titles Section based on route */}
        <div id="page-metadata-header" className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
              <span>{siteConfig.brandName} Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span className={`${siteConfig.accentTextColor} font-semibold`}>
                {currentPath === "/" && (siteConfig.navItems?.find(n => n.path === "/")?.label || "Live Polls")}
                {currentPath === "/stats" && (siteConfig.navItems?.find(n => n.path === "/stats")?.label || "Collective Stats")}
                {currentPath === "/admin" && (siteConfig.navItems?.find(n => n.path === "/admin")?.label || "Admin Console")}
              </span>
            </div>
            
            <h1 className="font-sans font-extrabold text-slate-900 text-3xl md:text-4xl tracking-tight leading-none mt-1">
              {currentPath === "/" && siteConfig.homeTitle}
              {currentPath === "/stats" && "Data Visualizations"}
              {currentPath === "/admin" && "Directory Control"}
            </h1>
            
            <p className="font-sans text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
              {currentPath === "/" && siteConfig.homeSubtitle}
              {currentPath === "/stats" && "Aggregated comparative analytics derived from real interactive telemetry registered during active browser sessions."}
              {currentPath === "/admin" && "Configure active polling campaigns, manage existing selections, and broadcast newly authored custom challenges instantly."}
            </p>
          </div>

          {/* Quick Stats Banner on right for Home/Stats page */}
          {currentPath !== "/admin" && (
            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-sm flex items-center gap-4.5 shrink-0 max-w-sm">
              <div className={`w-10 h-10 rounded-xl ${siteConfig.primaryAccentColor} text-white flex items-center justify-center shrink-0`}>
                <Vote className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-mono font-bold text-slate-500 uppercase tracking-wider">Active Campaigns</div>
                <div className="font-sans font-bold text-slate-900 text-base mt-0.5">{polls.length} Live Polls</div>
              </div>
            </div>
          )}
        </div>

        {/* COMPONENT TRANSITIONS WITH ANIMATION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HUMBLE SLEEK FOOTER (Rejects Telemetry Logs or margin clutter) */}
      <footer id="app-footer" className="bg-white border-t border-slate-100 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-sans font-extrabold tracking-tight text-slate-900 text-sm">
                {siteConfig.brandName}
              </span>
              <p className="font-sans text-xs text-slate-400 mt-1 max-w-md">
                {siteConfig.footerText}
              </p>
            </div>
            
            <div className="flex items-center gap-5">
              {(siteConfig.navItems || []).map((navItem) => (
                <button 
                  key={navItem.id}
                  onClick={() => handleNavigate(navItem.path)}
                  className={`font-sans text-xs transition-colors ${
                    currentPath === navItem.path 
                      ? `${siteConfig.accentTextColor} font-bold`
                      : "text-slate-500 hover:text-slate-800 font-semibold"
                  }`}
                >
                  {navItem.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-50 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="font-mono text-[10px] text-slate-400 font-semibold tracking-wider">
              CLIENT STATE STORAGE • DYNAMIC SYNC
            </span>
            <span className="font-sans text-[11px] text-slate-400">
              © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
