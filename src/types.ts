export interface PollOption {
  id: string;
  text: string;
  votes: number;
  response: string; // The specific feedback/response the user gets when they vote for this option
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  headingColor: string; // Tailwind background utility (e.g. bg-indigo-900, bg-emerald-900, bg-rose-900)
  textColor: string;    // Tailwind text utility (e.g. text-indigo-200, text-emerald-200, text-rose-200)
  accentColor: string;  // General accent color for buttons (e.g. bg-indigo-600, etc.)
  description: string;  // Detailed explanation or prompt for the poll
  category: string;     // e.g., "Creativity", "Productivity", "Aesthetics"
}

export interface UserVote {
  pollId: string;
  optionId: string;
  votedAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;       // path to navigate e.g. "/", "/stats", "/admin"
  iconName: string;   // e.g., "Vote", "BarChart3", "Shield", "Sparkles", "HelpCircle"
  badgeText?: string; // Optional badge text
}

export interface SiteConfig {
  brandName: string;
  brandSub: string;
  homeTitle: string;
  homeSubtitle: string;
  footerText: string;
  primaryAccentColor: string; // Tailwind background color class (e.g., bg-indigo-600)
  accentTextColor: string;    // Tailwind text color class (e.g., text-indigo-600)
  navItems: NavItem[];
}

