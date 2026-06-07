import { Poll, SiteConfig } from "./types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "SolidPolls",
  brandSub: "Interactive Engine",
  homeTitle: "Human Perspectives",
  homeSubtitle: "Cast your vote across our primary design, productivity, and lifestyle surveys to view immediate recommendations & custom breakdown stats.",
  footerText: "A highly-polished modern aesthetic feedback engine. Crafted for simple digital decisions.",
  primaryAccentColor: "bg-indigo-600",
  accentTextColor: "text-indigo-600",
  navItems: [
    { id: "nav-polls", label: "Live Polls", path: "/", iconName: "Vote" },
    { id: "nav-stats", label: "Collective Stats", path: "/stats", iconName: "BarChart3" },
    { id: "nav-admin", label: "Admin Console", path: "/admin", iconName: "Shield", badgeText: "Control" }
  ]
};

const SITE_CONFIG_KEY = "simple_polls_site_config";


export const INITIAL_POLLS: Poll[] = [
  {
    id: "creative-power",
    question: "What's your ultimate creative super-power?",
    description: "Every designer and developer has an inner genius. Identify the force that drives your daily workflow and creations.",
    category: "Creativity",
    headingColor: "bg-slate-900 border-b-4 border-indigo-500",
    textColor: "text-slate-100",
    accentColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
    options: [
      {
        id: "opt-1-1",
        text: "Pixel-Perfect Eye",
        votes: 38,
        response: "Your attention to detail is legendary! Designers and developers alike envy your pixel-level precision. Work on maintaining this standard while ensuring it doesn't slow down your velocity. Focus on mastery of modern layouts and crisp typography."
      },
      {
        id: "opt-1-2",
        text: "Flow-State Focus",
        votes: 52,
        response: "Incredible blocks of deep focus! You can completely block out ambient noise and build entire features or worlds in a single continuous session. Your super-power is flow. Protect your distraction-free slots and guard your rest times!"
      },
      {
        id: "opt-1-3",
        text: "Speed Prototyping",
        votes: 41,
        response: "You move fast, turning high-level concepts into interactive, live MVPs in minutes. You are an action-oriented builder. Keep creating mockups, testing ideas, but remember to occasionally build with solid foundation for scale!"
      },
      {
        id: "opt-1-4",
        text: "Empathetic Storytelling",
        votes: 29,
        response: "You understand exactly what the end-user feels. Your design choices speak directly to human needs, emotions, and practical comfort, not just technical specifications. You create apps with real soul!"
      }
    ]
  },
  {
    id: "inspiration-source",
    question: "Where do you get your best code & design ideas?",
    description: "Sometimes the screen drains us, and sometimes it fuels us. Pinpoint the setting where your brain solves its toughest architectural challenges.",
    category: "Productivity",
    headingColor: "bg-[#064e3b] border-b-4 border-emerald-400", // Solid Forest Green
    textColor: "text-emerald-50",
    accentColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    options: [
      {
        id: "opt-2-1",
        text: "Late Night Terminal Sessions",
        votes: 64,
        response: "A classic nocturne developer! The world is quiet, notifications are sleep-muted, and your creative brain peaks in the serene glow of the IDE. While highly productive, ensure your circadian rhythms remain healthy!"
      },
      {
        id: "opt-2-2",
        text: "Morning Walks offline",
        votes: 33,
        response: "A modern offline approach! Walking without a screen stimulates divergent thinking, allowing your brain to process complex structures automatically. You understand that some of the best keyboard work is done on foot!"
      },
      {
        id: "opt-2-3",
        text: "Scribbling in paper notebooks",
        votes: 21,
        response: "The analog rebel! Sketching code blocks or layout wires in a tactile notebook activates cognitive pathways that digital screens cannot replace. This tactile buffer keeps your ideas focused and clear."
      },
      {
        id: "opt-2-4",
        text: "Staring Blankly at the Ceiling",
        votes: 45,
        response: "The incubation champion! You understand that deep thinking requires letting your mind wander away from keyboard typing, allowing your subconscious backend to connect distant dots."
      }
    ]
  },
  {
    id: "design-accent",
    question: "Which design accent defines your current aesthetic?",
    description: "Your digital interface layout tells a story of who you are as a creator. Select the style guidelines that match your soul.",
    category: "Aesthetics",
    headingColor: "bg-[#881337] border-b-4 border-rose-400", // Solid Deep Rich Rose
    textColor: "text-rose-50",
    accentColor: "bg-rose-600 hover:bg-rose-700 text-white",
    options: [
      {
        id: "opt-3-1",
        text: "Neo-Brutalist (Bold, raw lines)",
        votes: 19,
        response: "Pure tactile energy! You value high-contrast outlines, thick drop shadows, high visibility, and uncompromising structural layout-level honesty. You like components that scream interface integrity."
      },
      {
        id: "opt-3-2",
        text: "Deep Minimalist (Max space, light font)",
        votes: 55,
        response: "Serene and highly refined! You let clean margins and negative space express the product's message, elevating pure typography layout and rejecting all unnecessary background noises."
      },
      {
        id: "opt-3-3",
        text: "Warm Retro (Groovy, pastel curves)",
        votes: 31,
        response: "Cozy, warm, and nostalgic! You inject human characters, warm palettes, and beautiful geometric curves into an otherwise rigid world, creating a cozy sanctuary for users."
      },
      {
        id: "opt-3-4",
        text: "Cyberpunk Dark (Electric neon accents)",
        votes: 42,
        response: "High-voltage and futuristic! You love absolute dark canvases paired with electric cyan, purple, and yellow accents that glow in the simulated environment. You build for tomorrow."
      }
    ]
  }
];

const STORAGE_KEY = "simple_polls_data";
const VOTED_KEY = "simple_polls_user_votes";

// Helper to load polls from storage or initial state
export function getStoredPolls(): Poll[] {
  if (typeof window === "undefined") return INITIAL_POLLS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POLLS));
      return INITIAL_POLLS;
    }
  } catch (error) {
    console.error("Failed to parse polls from localStorage", error);
    return INITIAL_POLLS;
  }
}

// Helper to store polls
export function savePolls(polls: Poll[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
  } catch (error) {
    console.error("Failed to write polls to localStorage", error);
  }
}

// Helper to get user's vote status for identifying who already voted on which polls
export function getUserVotes(): { [pollId: string]: string } {
  if (typeof window === "undefined") return {};
  try {
    const votesStr = localStorage.getItem(VOTED_KEY);
    return votesStr ? JSON.parse(votesStr) : {};
  } catch {
    return {};
  }
}

// Save user's voted action
export function recordUserVote(pollId: string, optionId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getUserVotes();
    current[pollId] = optionId;
    localStorage.setItem(VOTED_KEY, JSON.stringify(current));
  } catch (error) {
    console.error("Failed to write user vote record", error);
  }
}

// Reset all votes on specific or all polls
export function resetPollVotes(pollId: string | null = null): Poll[] {
  const current = getStoredPolls();
  const updated = current.map(p => {
    if (pollId === null || p.id === pollId) {
      return {
        ...p,
        options: p.options.map(opt => ({ ...opt, votes: 0 }))
      };
    }
    return p;
  });
  savePolls(updated);
  return updated;
}

export function getStoredSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_SITE_CONFIG;
  try {
    const data = localStorage.getItem(SITE_CONFIG_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(DEFAULT_SITE_CONFIG));
      return DEFAULT_SITE_CONFIG;
    }
  } catch (error) {
    console.error("Failed to parse site config from localStorage", error);
    return DEFAULT_SITE_CONFIG;
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save site config to localStorage", error);
  }
}

