import { useState } from "react";
import { CheckCircle2, RefreshCw, Sparkles, AlertCircle, Info, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Poll } from "../types";

interface PollsListProps {
  polls: Poll[];
  userVotes: { [pollId: string]: string };
  onVote: (pollId: string, optionId: string) => void;
  onClearVote: (pollId: string) => void;
}

export function PollsList({ polls, userVotes, onVote, onClearVote }: PollsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(polls.map((p) => p.category)))];

  const filteredPolls = selectedCategory === "All"
    ? polls
    : polls.filter((p) => p.category === selectedCategory);

  return (
    <div id="polls-list-wrapper" className="space-y-8">
      {/* Category selector pills */}
      <div id="category-selector" className="flex flex-wrap gap-2.5 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 max-w-max">
        {categories.map((category) => (
          <button
            id={`category-[${category.toLowerCase()}]`}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              selectedCategory === category
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {polls.length === 0 ? (
        <div id="no-polls-message" className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-8 max-w-md mx-auto">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-slate-900 text-lg">No Polls Available</h3>
          <p className="font-sans text-sm text-slate-500 mt-2">
            Create some beautiful polls inside the Admin Console to get started!
          </p>
        </div>
      ) : (
        <div id="polls-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPolls.map((poll) => {
            const hasVoted = !!userVotes[poll.id];
            const votedOptionId = userVotes[poll.id];
            
            // Calculate total votes
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            
            // Get selected option
            const selectedOption = poll.options.find((o) => o.id === votedOptionId);

            return (
              <motion.div
                id={`poll-card-${poll.id}`}
                key={poll.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
              >
                {/* 🌟 SOLID COLOR HEADING (Requirement fulfillment) */}
                <div 
                  id={`poll-header-${poll.id}`}
                  className={`${poll.headingColor} p-6 sm:p-8 flex flex-col gap-2 relative overflow-hidden`}
                >
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start gap-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm select-none text-white/90">
                      {poll.category}
                    </span>
                    <span className="font-mono text-[10px] text-white/70 font-semibold uppercase tracking-widest">
                      {totalVotes} {totalVotes === 1 ? "VOTE" : "VOTES"}
                    </span>
                  </div>

                  <h3 id={`poll-question-${poll.id}`} className={`font-sans font-extrabold text-xl sm:text-2xl leading-snug tracking-tight ${poll.textColor} mt-2`}>
                    {poll.question}
                  </h3>

                  <p className={`font-sans text-sm ${poll.textColor}/80 leading-relaxed font-normal mt-1.5`}>
                    {poll.description}
                  </p>
                </div>

                {/* Poll Options / Results Panel */}
                <div id={`poll-body-${poll.id}`} className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {!hasVoted ? (
                      /* Interactive Option Selector buttons */
                      <motion.div
                        key="voting-options"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <p className="font-sans text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                          Cast your vote to unlock response:
                        </p>
                        {poll.options.map((option) => (
                          <button
                            id={`poll-option-btn-${option.id}`}
                            key={option.id}
                            onClick={() => onVote(poll.id, option.id)}
                            className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-800 bg-white hover:bg-slate-50 transition-all duration-200 font-sans text-sm font-medium text-slate-800 flex justify-between items-center group shadow-sm hover:shadow"
                          >
                            <span className="pr-4 leading-relaxed">{option.text}</span>
                            <span className={`w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 border border-slate-300 flex items-center justify-center text-slate-500 bg-white transition-opacity duration-200`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    ) : (
                      /* Poll Results with Custom Feedback Response (Requirement fulfillment) */
                      <motion.div
                        key="voted-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* 🎁 DETAILED PERSONALIZED RESPONSE THEY GET */}
                        <div 
                          id={`poll-response-${poll.id}`}
                          className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100"
                        >
                          <div className="flex items-center gap-2 mb-2 text-indigo-600">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-sans text-xs font-extrabold uppercase tracking-widest text-slate-900">
                              Your Profile Response
                            </span>
                          </div>
                          
                          <p className="font-sans text-sm text-slate-700 leading-relaxed font-medium">
                            <span className="text-indigo-600 font-semibold italic">
                              "{selectedOption?.text}"
                            </span>{" "}
                            — {selectedOption?.response || `Thank you for sharing your opinion. Every response helps us build better insights!`}
                          </p>
                        </div>

                        {/* Detailed breakdown percentages */}
                        <div className="space-y-3.5">
                          <p className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Collective Poll Statistics
                          </p>
                          {poll.options.map((option) => {
                            const isUserChoice = option.id === votedOptionId;
                            // Safe percentage calculation
                            const percentage = totalVotes > 0 
                              ? Math.round((option.votes / totalVotes) * 100) 
                              : 0;

                            return (
                              <div id={`result-item-${option.id}`} key={option.id} className="space-y-1">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                  <span className={`font-sans ${isUserChoice ? "text-slate-900 font-bold" : "text-slate-600"}`}>
                                    {option.text} {isUserChoice && " (Your Choice)"}
                                  </span>
                                  <span className="font-mono text-slate-500">{percentage}% ({option.votes})</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full rounded-full ${
                                      isUserChoice 
                                        ? "bg-slate-900" 
                                        : "bg-slate-350"
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Reset Vote controls */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                          <span className="font-sans text-[11px] text-slate-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-slate-300" />
                            Votes are saved browser-historically
                          </span>
                          <button
                            id={`revote-btn-${poll.id}`}
                            onClick={() => onClearVote(poll.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Revote
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
