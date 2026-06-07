import React, { useState, useEffect } from "react";
import { 
  Trash2, Plus, RotateCcw, Sparkles, Check, 
  HelpCircle, Undo, AlertTriangle, ListPlus, Terminal,
  Settings, Edit3, Save, X, Layers, Layout, Palette,
  PlusCircle, CheckCircle2, ChevronRight, Hash, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Poll, PollOption, SiteConfig, NavItem } from "../types";

interface AdminPanelProps {
  polls: Poll[];
  onSavePolls: (updatedPolls: Poll[]) => void;
  onResetVotes: (pollId: string | null) => void;
  siteConfig: SiteConfig;
  onSaveSiteConfig: (newConfig: SiteConfig) => void;
}

const COLOR_PRESETS = [
  { id: "indigo", bg: "bg-slate-900 border-b-4 border-indigo-500", text: "text-slate-100", label: "Dark Indigo Accent" },
  { id: "emerald", bg: "bg-[#064e3b] border-b-4 border-emerald-400", text: "text-emerald-50", label: "Forest Emerald" },
  { id: "rose", bg: "bg-[#881337] border-b-4 border-rose-400", text: "text-rose-50", label: "Sunset Ruby" },
  { id: "violet", bg: "bg-indigo-950 border-b-4 border-violet-400", text: "text-violet-50", label: "Solid Deep Violet" },
  { id: "amber", bg: "bg-amber-955 border-b-4 border-yellow-400", text: "text-amber-50", label: "Honey Amber" },
  { id: "coal", bg: "bg-zinc-900 border-b-4 border-slate-400", text: "text-zinc-100", label: "Midnight Carbon" }
];

export function AdminPanel({ polls, onSavePolls, onResetVotes, siteConfig, onSaveSiteConfig }: AdminPanelProps) {
  // Tabs: "polls" or "site"
  const [activeTab, setActiveTab] = useState<"polls" | "site">("polls");

  // EDIT ENGINE FOR POLLS
  const [isEditingPoll, setIsEditingPoll] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);

  // Poll Form Fields
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Directives");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [customHeadingBg, setCustomHeadingBg] = useState("");
  const [customHeadingText, setCustomHeadingText] = useState("");

  // Options lists include editable vote scores!
  const [options, setOptions] = useState<(Omit<PollOption, "id"> & { id?: string })[]>([
    { text: "Option A", votes: 0, response: "Excellent choice! You possess the traits of a builder." },
    { text: "Option B", votes: 0, response: "Intriguing angle. You see opportunities in every challenge." },
    { text: "Option C", votes: 0, response: "Pragmatic decision. Reliability is your finest quality." }
  ]);

  // SITE SETTINGS CONFIGURATOR fields
  const [brandName, setBrandName] = useState(siteConfig.brandName);
  const [brandSub, setBrandSub] = useState(siteConfig.brandSub);
  const [homeTitle, setHomeTitle] = useState(siteConfig.homeTitle);
  const [homeSubtitle, setHomeSubtitle] = useState(siteConfig.homeSubtitle);
  const [footerText, setFooterText] = useState(siteConfig.footerText);
  const [primaryAccentColor, setPrimaryAccentColor] = useState(siteConfig.primaryAccentColor);
  const [accentTextColor, setAccentTextColor] = useState(siteConfig.accentTextColor);
  
  // Custom Dynamic NavItems Manager
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Messages states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Synchronize SiteConfig options on component load / update
  useEffect(() => {
    setBrandName(siteConfig.brandName);
    setBrandSub(siteConfig.brandSub);
    setHomeTitle(siteConfig.homeTitle);
    setHomeSubtitle(siteConfig.homeSubtitle);
    setFooterText(siteConfig.footerText);
    setPrimaryAccentColor(siteConfig.primaryAccentColor);
    setAccentTextColor(siteConfig.accentTextColor);
    setNavItems(siteConfig.navItems || []);
  }, [siteConfig]);

  // Load selected poll into form for updating
  const handleStartEditPoll = (poll: Poll) => {
    setIsEditingPoll(true);
    setEditingPollId(poll.id);
    setQuestion(poll.question);
    setDescription(poll.description);
    setCategory(poll.category);
    
    // Find preset color index or match
    const foundColorIdx = COLOR_PRESETS.findIndex(c => c.bg === poll.headingColor);
    if (foundColorIdx !== -1) {
      setSelectedColorIndex(foundColorIdx);
      setCustomHeadingBg("");
      setCustomHeadingText("");
    } else {
      setSelectedColorIndex(-1); // custom mode
      setCustomHeadingBg(poll.headingColor);
      setCustomHeadingText(poll.textColor);
    }

    setOptions(poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes,
      response: opt.response
    })));

    setValidationError(null);
    setSuccessMessage(null);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEditPoll = () => {
    setIsEditingPoll(false);
    setEditingPollId(null);
    setQuestion("");
    setDescription("");
    setCategory("Directives");
    setSelectedColorIndex(0);
    setCustomHeadingBg("");
    setCustomHeadingText("");
    setOptions([
      { text: "Option A", votes: 0, response: "Excellent choice! You possess the traits of a builder." },
      { text: "Option B", votes: 0, response: "Intriguing angle. You see opportunities in every challenge." },
      { text: "Option C", votes: 0, response: "Pragmatic decision. Reliability is your finest quality." }
    ]);
    setValidationError(null);
  };

  // Poll Option field additions
  const handleAddOptionField = () => {
    setOptions([...options, { text: "", votes: 0, response: "" }]);
    setValidationError(null);
  };

  const handleRemoveOptionField = (idx: number) => {
    if (options.length <= 2) {
      setValidationError("Each poll requires at least two choices to remain valid.");
      return;
    }
    setOptions(options.filter((_, i) => i !== idx));
    setValidationError(null);
  };

  const handleOptionChange = (idx: number, field: "text" | "response" | "votes", val: any) => {
    const updated = [...options];
    if (field === "votes") {
      updated[idx] = { ...updated[idx], votes: Math.max(0, parseInt(val) || 0) };
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }
    setOptions(updated);
  };

  // Submit Handler for Polls (Acts as both Add/Create and Edit/Update based on status!)
  const handleSavePollForm = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    if (!question.trim()) {
      setValidationError("Please input a valid Poll Question text label.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Please input a background descriptive prompt.");
      return;
    }

    const hasIncompleteOptions = options.some(opt => !opt.text.trim() || !opt.response.trim());
    if (hasIncompleteOptions) {
      setValidationError("All decision options require both option texts and direct response values.");
      return;
    }

    // Determine final color styles
    let finalBg = "";
    let finalText = "";
    if (selectedColorIndex !== -1) {
      const activePreset = COLOR_PRESETS[selectedColorIndex];
      finalBg = activePreset.bg;
      finalText = activePreset.text;
    } else {
      finalBg = customHeadingBg.trim() || "bg-indigo-900 border-b-2 border-indigo-400";
      finalText = customHeadingText.trim() || "text-indigo-100";
    }

    let accentStyle = "bg-slate-800 hover:bg-slate-900 text-white";
    if (finalBg.includes("indigo")) accentStyle = "bg-indigo-600 hover:bg-indigo-700 text-white";
    else if (finalBg.includes("emerald")) accentStyle = "bg-emerald-600 hover:bg-emerald-700 text-white";
    else if (finalBg.includes("rose")) accentStyle = "bg-rose-600 hover:bg-rose-700 text-white";
    else if (finalBg.includes("violet")) accentStyle = "bg-violet-600 hover:bg-violet-700 text-white";
    else if (finalBg.includes("amber")) accentStyle = "bg-amber-600 hover:bg-amber-700 text-white";

    if (isEditingPoll && editingPollId) {
      // Modify existing poll
      const updatedList = polls.map(p => {
        if (p.id === editingPollId) {
          return {
            ...p,
            question: question.trim(),
            description: description.trim(),
            category: category.trim(),
            headingColor: finalBg,
            textColor: finalText,
            accentColor: accentStyle,
            options: options.map((opt, oIdx) => ({
              id: opt.id || `opt-${editingPollId}-${oIdx}-${Date.now()}`,
              text: opt.text.trim(),
              votes: opt.votes,
              response: opt.response.trim()
            }))
          };
        }
        return p;
      });

      onSavePolls(updatedList);
      setSuccessMessage("Poll updated and options synced back to database files.");
      handleCancelEditPoll();
    } else {
      // Create new poll
      const pollId = `poll-${Date.now()}`;
      const newPoll: Poll = {
        id: pollId,
        question: question.trim(),
        description: description.trim(),
        category: category.trim(),
        headingColor: finalBg,
        textColor: finalText,
        accentColor: accentStyle,
        options: options.map((opt, oIdx) => ({
          id: `opt-${pollId}-${oIdx}`,
          text: opt.text.trim(),
          votes: opt.votes || 0,
          response: opt.response.trim()
        }))
      };

      onSavePolls([newPoll, ...polls]);
      setSuccessMessage("Newly authored active poll has been broadcasted globally.");
      
      // Resets
      setQuestion("");
      setDescription("");
      setCategory("Directives");
      setSelectedColorIndex(0);
      setCustomHeadingBg("");
      setCustomHeadingText("");
      setOptions([
        { text: "Option A", votes: 0, response: "Excellent choice! You possess the traits of a builder." },
        { text: "Option B", votes: 0, response: "Intriguing angle. You see opportunities in every challenge." },
        { text: "Option C", votes: 0, response: "Pragmatic decision. Reliability is your finest quality." }
      ]);
    }

    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Delete Individual Poll
  const handleDeletePoll = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this poll entry? This deletes all votes.")) {
      const filtered = polls.filter((p) => p.id !== id);
      onSavePolls(filtered);
      if (editingPollId === id) {
        handleCancelEditPoll();
      }
    }
  };

  // SITE CONFIGURATION ACTION HANDLERS
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    if (!brandName.trim() || !homeTitle.trim() || !homeSubtitle.trim()) {
      setValidationError("Brand, Home Page Title, and Description are required to maintain layout standards.");
      return;
    }

    const updatedConfig: SiteConfig = {
      brandName: brandName.trim(),
      brandSub: brandSub.trim(),
      homeTitle: homeTitle.trim(),
      homeSubtitle: homeSubtitle.trim(),
      footerText: footerText.trim(),
      primaryAccentColor: primaryAccentColor.trim() || "bg-indigo-600",
      accentTextColor: accentTextColor.trim() || "text-indigo-600",
      navItems: navItems
    };

    onSaveSiteConfig(updatedConfig);
    setSuccessMessage("Site settings, customizable colors, and static navigation configurations updated.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // NavItem List Manipulations
  const handleUpdateNavItem = (index: number, field: keyof NavItem, value: string) => {
    const updated = [...navItems];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setNavItems(updated);
  };

  const handleDeleteNavItem = (index: number) => {
    if (navItems.length <= 1) {
      setValidationError("You must have at least one active navigation menu item.");
      return;
    }
    const filtered = navItems.filter((_, i) => i !== index);
    setNavItems(filtered);
    setValidationError(null);
  };

  const handleAddNavItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: "New Page Tab",
      path: "/custom-url-" + navItems.length,
      iconName: "Sparkles",
      badgeText: ""
    };
    setNavItems([...navItems, newItem]);
    setValidationError(null);
  };

  // Helper active color preview background
  const getPreviewBg = () => {
    if (selectedColorIndex !== -1) {
      return COLOR_PRESETS[selectedColorIndex].bg;
    }
    return customHeadingBg || "bg-slate-900";
  };

  const getPreviewText = () => {
    if (selectedColorIndex !== -1) {
      return COLOR_PRESETS[selectedColorIndex].text;
    }
    return customHeadingText || "text-slate-100";
  };

  return (
    <div id="admin-panel-root" className="space-y-10">
      
      {/* Dynamic Tab Selector Rails */}
      <div id="admin-tabs" className="flex border-b border-slate-200 gap-1.5 scrollbar-none overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab("polls"); setValidationError(null); setSuccessMessage(null); }}
          className={`flex items-center gap-2 py-3.5 px-6 font-sans text-sm font-bold border-b-2 transition-all ${
            activeTab === "polls"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          Polls Engine Database
        </button>

        <button
          onClick={() => { setActiveTab("site"); setValidationError(null); setSuccessMessage(null); }}
          className={`flex items-center gap-2 py-3.5 px-6 font-sans text-sm font-bold border-b-2 transition-all ${
            activeTab === "site"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          Design Layout & Menu Links
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "polls" ? (
          /* ========================================================
             POLLS TAB - FULL CREATE & EDIT OPERATIONS
             ======================================================== */
          <motion.div
            key="tab-polls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* Poll Creation / Inline Edit Block */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
                
                <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <h3 className="font-sans font-extrabold text-slate-900 text-lg flex items-center gap-2">
                      <ListPlus className="w-5.5 h-5.5 text-indigo-600" />
                      {isEditingPoll ? "Edit Core Poll Configuration" : "Create New Interactive Poll"}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 mt-1">
                      {isEditingPoll 
                        ? `Modifying entry identity "${editingPollId}". Sync saves immediately.`
                        : "Author dynamic decisions, choose color alignments, and map responses."}
                    </p>
                  </div>

                  {isEditingPoll && (
                    <button
                      type="button"
                      onClick={handleCancelEditPoll}
                      className="px-3 py-1.5 bg-slate-100 font-sans text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Create
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePollForm} className="space-y-6">
                  {validationError && (
                    <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                      {validationError}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2">
                      <Check className="w-4.5 h-4.5 shrink-0" />
                      {successMessage}
                    </div>
                  )}

                  {/* Primary text fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Poll Question Text</label>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., Which environment variables are private?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Stream Category Title</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Architecture, Design, DevLife"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Detailed Descriptive Intro</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add an interesting prompt or brief story to motivate participation..."
                      rows={2.5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 resize-none focus:ring-1 focus:ring-slate-800"
                      required
                    />
                  </div>

                  {/* CUSTOM COLORS AND PRESETS SELECTOR */}
                  <div className="space-y-3.5">
                    <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-widest leading-none">
                      Solid Header Background Styling
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {COLOR_PRESETS.map((preset, idx) => (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => { setSelectedColorIndex(idx); }}
                          className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all ${
                            selectedColorIndex === idx 
                              ? "border-slate-900 bg-slate-50/50 shadow-sm" 
                              : "border-slate-100 bg-white hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-full h-4 rounded-md ${preset.bg} mb-1.5`} />
                          <span className="font-sans text-[11px] font-bold text-slate-800 leading-none">{preset.label}</span>
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setSelectedColorIndex(-1)}
                        className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all ${
                          selectedColorIndex === -1 
                            ? "border-slate-900 bg-slate-50/50" 
                            : "border-slate-100 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="w-full h-4 rounded-md bg-gradient-to-r from-violet-500 via-rose-500 to-amber-400 mb-1.5" />
                        <span className="font-sans text-[11px] font-bold text-slate-800 leading-none">Custom Style Mode</span>
                      </button>
                    </div>

                    {/* Custom style manual inputs shown only when Custom Mode selected */}
                    {selectedColorIndex === -1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-xl"
                      >
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tailwind Background Classes</label>
                          <input
                            type="text"
                            value={customHeadingBg}
                            onChange={(e) => setCustomHeadingBg(e.target.value)}
                            placeholder="bg-gradient-to-r from-indigo-900 to-slate-900"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tailwind Text Classes</label>
                          <input
                            type="text"
                            value={customHeadingText}
                            onChange={(e) => setCustomHeadingText(e.target.value)}
                            placeholder="text-zinc-100"
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* PREVIEW CONTAINER */}
                  <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-100">
                    <div className="px-4 py-2 bg-slate-750 text-white/80 font-mono text-[9px] font-bold uppercase tracking-wider">Site Heading Render Preview</div>
                    <div className={`${getPreviewBg()} p-6 sm:p-8 flex flex-col gap-2 relative`}>
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white leading-none self-start">
                        {category || "CATEGORY"}
                      </span>
                      <h4 className={`font-sans font-extrabold text-lg sm:text-xl mt-1.5 leading-tight ${getPreviewText()}`}>
                        {question || "Poll Subject Context..."}
                      </h4>
                      <p className={`font-sans text-xs sm:text-sm mt-0.5 opacity-90 ${getPreviewText()}`}>
                        {description || "Active instruction layout summary displayed for public users..."}
                      </p>
                    </div>
                  </div>

                  {/* OPTIONS EDITOR (Add text, feedback response, AND edit counts!) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <label className="block font-sans text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Choices List & Target Returns
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOptionField}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 hover:text-indigo-600 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Option Choice
                      </button>
                    </div>

                    <div className="space-y-3">
                      {options.map((opt, idx) => (
                        <div id={`opt-adm-row-${idx}`} key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 flex flex-col gap-3.5 relative">
                          <div className="flex justify-between items-center">
                            <span className="font-sans text-xs font-extrabold text-slate-500 flex items-center gap-1.5">
                              <span className="inline-flex items-center justify-center w-5.5 h-5.5 bg-slate-900 text-white font-mono text-[10px] rounded-lg">
                                {idx + 1}
                              </span>
                              Option Entity
                            </span>

                            {options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOptionField(idx)}
                                className="p-1 text-slate-350 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                                title="Remove Choice"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                            
                            {/* Choice label text */}
                            <div className="lg:col-span-4">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Option Choice Text</label>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                                placeholder="e.g. Design Systems"
                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                                required
                              />
                            </div>

                            {/* Option feedback response (changeable!) */}
                            <div className="lg:col-span-6">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recipient Response Line</label>
                              <input
                                type="text"
                                value={opt.response}
                                onChange={(e) => handleOptionChange(idx, "response", e.target.value)}
                                placeholder="Recipient view feedback..."
                                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                                required
                              />
                            </div>

                            {/* Option vote count (completely customizable / changeable!) */}
                            <div className="lg:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vote Count</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  value={opt.votes}
                                  onChange={(e) => handleOptionChange(idx, "votes", e.target.value)}
                                  className="w-full pl-7 pr-2.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-850 focus:outline-none focus:border-slate-800 text-center"
                                  required
                                />
                                <Hash className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    {isEditingPoll && (
                      <button
                        type="button"
                        onClick={handleCancelEditPoll}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-sans text-xs font-bold transition-all"
                      >
                        Cancel Editing
                      </button>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-sans text-xs font-extrabold shadow transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      {isEditingPoll ? "Save Engine Update ID" : "Broadcast Survey Live"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* LIVE ENTRIES DIRECTORY LIST */}
            <div className="xl:col-span-1 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm flex flex-col gap-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-sans font-bold text-slate-900 text-base">
                    Active Collections ({polls.length})
                  </h3>
                  <p className="font-sans text-xs text-slate-500">Edit, change, or drop any entries below.</p>
                </div>

                <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                  {polls.map((p) => {
                    const optionVotesSum = p.options.reduce((s, o) => s + o.votes, 0);
                    const isSelected = editingPollId === p.id;

                    return (
                      <div 
                        id={`adm-entry-${p.id}`} 
                        key={p.id} 
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isSelected 
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                            : "bg-slate-50/70 border-slate-150 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                              isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                            }`}>
                              {p.category}
                            </span>
                            
                            <span className="font-mono text-[9px] opacity-70 font-semibold uppercase tracking-wider">
                              {optionVotesSum} Votes
                            </span>
                          </div>

                          <h4 className={`font-sans font-extrabold text-xs truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {p.question}
                          </h4>
                        </div>

                        {/* Operation tools buttons */}
                        <div className="flex justify-end gap-1.5 mt-3 border-t border-slate-200/10 pt-2.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditPoll(p)}
                            className={`p-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all ${
                              isSelected
                                ? "bg-white/20 text-white hover:bg-white/30"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePoll(p.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isSelected
                                ? "text-rose-300 hover:bg-rose-500/10"
                                : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                            title="Delete Poll Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset operations */}
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm">
                <h3 className="font-sans font-bold text-slate-900 text-base flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-500" />
                  Client DB Sweeps
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                  Reset the database to launch status or sweep registered live votes of all active polls.
                </p>
                
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Reset ALL registered vote counts back to 0? This actions clears user records.")) {
                        onResetVotes(null);
                        handleCancelEditPoll();
                      }
                    }}
                    className="w-full py-2 px-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-350 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Undo className="w-4 h-4 text-slate-400" />
                    Reset All Votes to Zero
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* ========================================================
             SITE SETTINGS TAB - CHANGE BRAND NAME, LAYOUT & MENUS
             ======================================================== */
          <motion.div
            key="tab-site"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* BRANDING CONFIGURATION FORM */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-150 shadow-sm">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h3 className="font-sans font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Layout className="w-5.5 h-5.5 text-indigo-600" />
                    Interactive Brand & Layout Settings
                  </h3>
                  <p className="font-sans text-xs text-slate-500 mt-1">
                    Change site branding titles, sub-markers, header styles, and footer coordinates instantly.
                  </p>
                </div>

                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  {validationError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {validationError}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      {successMessage}
                    </div>
                  )}

                  {/* Header Branding Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Brand Logo Text</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. SolidPolls"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Sub brand line</label>
                      <input
                        type="text"
                        value={brandSub}
                        onChange={(e) => setBrandSub(e.target.value)}
                        placeholder="e.g. Interactive Engine"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Landing Screen Hero Rows */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Home Main Heading Title</label>
                      <input
                        type="text"
                        value={homeTitle}
                        onChange={(e) => setHomeTitle(e.target.value)}
                        placeholder="e.g. Human Perspectives"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Home Subheading Context Prompt</label>
                      <textarea
                        value={homeSubtitle}
                        onChange={(e) => setHomeSubtitle(e.target.value)}
                        placeholder="e.g. Cast your vote dynamically to reveal profile breakdown responses..."
                        rows={2.5}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Accent design colors change */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Site Primary Accent Bg Class</label>
                      <input
                        type="text"
                        value={primaryAccentColor}
                        onChange={(e) => setPrimaryAccentColor(e.target.value)}
                        placeholder="e.g. bg-indigo-600"
                        className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Site Accent Text Class</label>
                      <input
                        type="text"
                        value={accentTextColor}
                        onChange={(e) => setAccentTextColor(e.target.value)}
                        placeholder="e.g. text-indigo-600"
                        className="w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Footer config */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Footer Credits Text</label>
                    <input
                      type="text"
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      placeholder="Footer descriptive attribution label..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800"
                      required
                    />
                  </div>

                  {/* Save button settings */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl font-sans text-xs font-extrabold shadow transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Save General Branding
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* DYNAMIC NAVIGATION LINKS MANAGER (Highly requested Changeble, Addable, Deletable Menu list!) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm flex flex-col gap-4">
                
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-sans font-bold text-slate-900 text-base">
                      Header Navigation Menu
                    </h3>
                    <p className="font-sans text-xs text-slate-500">Edit, add, or drop menu links below.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddNavItem}
                    className="p-1 px-2.5 bg-slate-900 hover:bg-slate-950 rounded-lg text-white font-sans text-[10px] font-extrabold tracking-wider uppercase inline-flex items-center gap-1"
                    title="Add Custom Menu Tab Link"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                  {navItems.map((item, index) => (
                    <div id={`nav-manage-${item.id}`} key={item.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-3 relative">
                      
                      {/* Delete button bar */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase bg-white px-1.5 py-0.5 rounded border border-slate-100">
                          LINK CONTEXT #{index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteNavItem(index)}
                          className="p-1 text-slate-350 hover:text-rose-600 rounded"
                          title="Remove Navigation Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inputs for navigation links attributes */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Label Text</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleUpdateNavItem(index, "label", e.target.value)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none"
                            placeholder="Home"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Path Link</label>
                            <input
                              type="text"
                              value={item.path}
                              onChange={(e) => handleUpdateNavItem(index, "path", e.target.value)}
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                              placeholder="/"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lucide Icon</label>
                            <input
                              type="text"
                              value={item.iconName}
                              onChange={(e) => handleUpdateNavItem(index, "iconName", e.target.value)}
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                              placeholder="Vote, Shield or generic icon"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Optional Badge Tag</label>
                          <input
                            type="text"
                            value={item.badgeText || ""}
                            onChange={(e) => handleUpdateNavItem(index, "badgeText", e.target.value)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                            placeholder="e.g. New (leave blank for none)"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...siteConfig,
                        navItems: navItems
                      };
                      onSaveSiteConfig(updated);
                      setSuccessMessage("Navigation header items list saved.");
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Save Navigation Links Customization
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
