import { BarChart3, TrendingUp, Users, Sparkles, Award } from "lucide-react";
import { Poll } from "../types";

interface GlobalStatsProps {
  polls: Poll[];
}

export function GlobalStats({ polls }: GlobalStatsProps) {
  // Compute global summary metrics
  const totalVotesAcrossAllPolls = polls.reduce((total, p) => {
    return total + p.options.reduce((sum, opt) => sum + opt.votes, 0);
  }, 0);

  // Find most popular poll option based on pure vote counts
  let mostPopularOption = { text: "None", votes: 0, pollQuestion: "No Polls" };
  polls.forEach((p) => {
    p.options.forEach((opt) => {
      if (opt.votes > mostPopularOption.votes) {
        mostPopularOption = {
          text: opt.text,
          votes: opt.votes,
          pollQuestion: p.question,
        };
      }
    });
  });

  // Calculate highest participation category
  const categoryParticipation: { [key: string]: number } = {};
  polls.forEach((p) => {
    const pVotes = p.options.reduce((sum, opt) => sum + opt.votes, 0);
    categoryParticipation[p.category] = (categoryParticipation[p.category] || 0) + pVotes;
  });

  let topCategory = "None";
  let topCategoryVotes = 0;
  Object.entries(categoryParticipation).forEach(([cat, votes]) => {
    if (votes > topCategoryVotes) {
      topCategoryVotes = votes;
      topCategory = cat;
    }
  });

  return (
    <div id="global-stats-container" className="space-y-8">
      {/* Overview Cards (Bento Style Grid) */}
      <div id="stats-bento-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Engagements */}
        <div id="metric-total-engagements" className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Responses
            </span>
            <span className="block font-mono text-3xl font-extrabold text-slate-900 mt-1">
              {totalVotesAcrossAllPolls}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5 font-medium">
              Registered across active entries
            </span>
          </div>
        </div>

        {/* Metric 2: Top Choice Option */}
        <div id="metric-top-choice" className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
            <Award className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Highest Voted Idea
            </span>
            <span className="block text-base font-extrabold text-slate-900 truncate mt-1">
              {mostPopularOption.votes > 0 ? mostPopularOption.text : "Pending Votes"}
            </span>
            <span className="block text-[11px] text-indigo-600/90 truncate font-semibold mt-0.5">
              {mostPopularOption.votes > 0 ? `${mostPopularOption.votes} voters choice • ${mostPopularOption.pollQuestion}` : "Cast your votes first!"}
            </span>
          </div>
        </div>

        {/* Metric 3: Highest Active Stream Category */}
        <div id="metric-active-category" className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Top Active Stream
            </span>
            <span className="block font-mono text-2xl font-extrabold text-slate-900 mt-1 uppercase">
              {topCategory}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5 font-medium">
              Leading the stream with {topCategoryVotes} actions
            </span>
          </div>
        </div>
      </div>

      {/* Main comparative analytics card */}
      <div id="detailed-statistics-board" className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex self-start gap-2 h-max items-center pb-6 border-b border-slate-100">
          <BarChart3 className="w-5.5 h-5.5 text-slate-800" />
          <div>
            <h3 className="font-sans font-bold text-slate-900 text-lg">Engagement Distribution Overview</h3>
            <p className="font-sans text-xs text-slate-500">Compare overall results side-by-side across active user polls.</p>
          </div>
        </div>

        <div className="space-y-8 pt-8">
          {polls.map((poll) => {
            const pVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div id={`stats-comparison-${poll.id}`} key={poll.id} className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50 mb-1 leading-none select-none">
                      {poll.category}
                    </span>
                    <h4 className="font-sans font-bold text-slate-800 text-sm md:text-base leading-tight">
                      {poll.question}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Votes</span>
                    <span className="font-mono text-sm md:text-base font-extrabold text-slate-800 block">
                      {pVotes}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  {poll.options.map((option) => {
                    const pct = pVotes > 0 ? Math.round((option.votes / pVotes) * 100) : 0;

                    return (
                      <div id={`stats-option-${option.id}`} key={option.id} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-sans text-slate-600 font-semibold">{option.text}</span>
                          <span className="font-mono text-slate-500">{pct}% ({option.votes})</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full rounded-full bg-slate-800 transition-all duration-700 ease-out"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
