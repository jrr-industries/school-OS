import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  FileQuestion,
  BookMarked,
  CheckSquare,
  BarChart2,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export const AIAssistantModule: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>("lesson_plan");
  const [topicInput, setTopicInput] = useState<string>(
    "Quadratic Equations & Parabolic Trajectories"
  );
  const [gradeInput, setGradeInput] = useState<string>("10A");
  const [subjectInput, setSubjectInput] = useState<string>("Mathematics");
  const [contextInput, setContextInput] = useState<string>("");

  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const aiTools = [
    { id: "lesson_plan", label: "Generate Lesson Plan", icon: BookOpen },
    { id: "quiz", label: "Generate Quiz", icon: HelpCircle },
    { id: "worksheet", label: "Generate Worksheet", icon: FileText },
    { id: "question_paper", label: "Generate Question Paper", icon: FileQuestion },
    { id: "summarize_chapter", label: "Summarize Chapter", icon: BookMarked },
    { id: "homework", label: "Create Homework", icon: CheckSquare },
    { id: "student_performance", label: "Analyze Student Performance", icon: BarChart2 },
    { id: "suggest_weak_students", label: "Suggest Weak Students Plan", icon: AlertTriangle },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedAction,
          topic: topicInput,
          grade: gradeInput,
          subject: subjectInput,
          additionalContext: contextInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiOutput(data.text);
      } else {
        setAiOutput(`Error: ${data.error || "Failed to generate AI response"}`);
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      setAiOutput("Server connection error. Please verify server backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="space-y-6">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Bot size={22} />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              SchoolOS AI Teaching Assistant
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini 3.6 Flash Powered
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Automate curriculum planning, exam question papers, differentiated worksheets, and student remediation plans instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 8 Quick AI Tool Cards (Section 11 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {aiTools.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedAction === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedAction(t.id)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80"
              }`}
            >
              <Icon size={18} className={isSelected ? "text-emerald-400" : "text-slate-400"} />
              <span className="text-[11px] font-bold leading-tight">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Controls & Execution Box */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Curriculum Subject
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Grade / Class
            </label>
            <input
              type="text"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Topic / Chapter Name
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Additional Context / Student Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Include 2 challenge problems for advanced students, focus on formula derivations..."
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 active:scale-98"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Content with Gemini AI...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Content ({selectedAction.replace("_", " ").toUpperCase()})
            </>
          )}
        </button>
      </div>

      {/* Output Panel */}
      {aiOutput && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Bot size={18} /> Generated Output
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-200 transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Output"}
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {aiOutput}
          </div>
        </div>
      )}
    </section>
  );
};
