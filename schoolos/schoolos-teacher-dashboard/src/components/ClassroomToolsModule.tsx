import React, { useRef, useState, useEffect } from "react";
import {
  Presentation,
  PenTool,
  Eraser,
  RotateCcw,
  Monitor,
  Upload,
  BookOpen,
  MessageSquare,
  Megaphone,
  CheckCircle2,
  Square,
  Circle,
  Sparkles,
} from "lucide-react";

interface ClassroomToolsModuleProps {
  onTakeAttendance: () => void;
  onCreateAnnouncement: () => void;
}

export const ClassroomToolsModule: React.FC<ClassroomToolsModuleProps> = ({
  onTakeAttendance,
  onCreateAnnouncement,
}) => {
  const [activeToolTab, setActiveToolTab] = useState<
    "smartboard" | "discussion" | "notes" | "homework"
  >("smartboard");

  // Smartboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#10b981");
  const [lineWidth, setLineWidth] = useState(3);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");

  // Screen share simulator state
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Discussion state
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "Mrs. Emily Carter",
      role: "Teacher",
      text: "Welcome Grade 10A! Please open page 142 on quadratic discriminants.",
      time: "10:30 AM",
    },
    {
      id: "2",
      user: "David Chen",
      role: "Student",
      text: "Mrs. Carter, is b^2 - 4ac negative when the graph doesn't touch the x-axis?",
      time: "10:32 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Canvas drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dark chalkboard background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = mode === "eraser" ? "#020617" : color;
    ctx.lineWidth = mode === "eraser" ? lineWidth * 6 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        user: "Mrs. Emily Carter",
        role: "Teacher",
        text: newMessage,
        time: "Just Now",
      },
    ]);
    setNewMessage("");
  };

  return (
    <section className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Presentation size={20} className="text-teal-400" />
            Interactive Classroom Tools Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time digital chalkboard, screen broadcast, note sharing, and live discussion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onTakeAttendance}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <CheckCircle2 size={15} />
            Take Attendance
          </button>

          <button
            onClick={() => setIsSharingScreen(!isSharingScreen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition border ${
              isSharingScreen
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Monitor size={15} className="text-cyan-400" />
            {isSharingScreen ? "Stop Sharing" : "Share Screen"}
          </button>

          <button
            onClick={onCreateAnnouncement}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
          >
            <Megaphone size={15} className="text-amber-400" />
            Announcements
          </button>
        </div>
      </div>

      {/* Sharing screen alert banner if active */}
      {isSharingScreen && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            LIVE SCREEN BROADCAST ACTIVE • Grade 10B Room 304 Smart Display Connected
          </div>
          <button
            onClick={() => setIsSharingScreen(false)}
            className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px]"
          >
            End Stream
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "smartboard", label: "Smart Board Canvas", icon: PenTool },
          { id: "discussion", label: "Live Class Discussion", icon: MessageSquare },
          { id: "notes", label: "Upload Class Notes", icon: Upload },
          { id: "homework", label: "Homework Manager", icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveToolTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeToolTab === tab.id
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SMART BOARD CANVAS */}
      {activeToolTab === "smartboard" && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            {/* Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("pen")}
                className={`p-2 rounded-lg border transition ${
                  mode === "pen"
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
                title="Pen Tool"
              >
                <PenTool size={16} />
              </button>

              <button
                onClick={() => setMode("eraser")}
                className={`p-2 rounded-lg border transition ${
                  mode === "eraser"
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
                title="Eraser Tool"
              >
                <Eraser size={16} />
              </button>

              <button
                onClick={clearCanvas}
                className="p-2 rounded-lg bg-slate-900 text-rose-400 border border-slate-800 hover:bg-slate-800 transition"
                title="Clear Chalkboard"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Color Palette */}
            {mode === "pen" && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Pen Color:</span>
                {["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#38bdf8", "#ffffff"].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        color === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  )
                )}
              </div>
            )}

            {/* Pen Stroke Width */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Stroke Size:</span>
              <input
                type="range"
                min={1}
                max={12}
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-24 accent-teal-500"
              />
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-80 bg-slate-950 cursor-crosshair touch-none"
            />
            <div className="absolute top-2 right-2 text-[10px] bg-slate-900/80 px-2 py-1 rounded text-slate-400 border border-slate-800">
              Grade 10B Digital Chalkboard • Click and drag to write math equations
            </div>
          </div>
        </div>
      )}

      {/* CLASS DISCUSSION */}
      {activeToolTab === "discussion" && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Live Classroom Chat Feed</h3>

          <div className="h-64 overflow-y-auto space-y-2.5 p-4 rounded-xl bg-slate-950 border border-slate-800 custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border max-w-lg text-xs space-y-1 ${
                  m.role === "Teacher"
                    ? "bg-emerald-950/40 border-emerald-500/30 ml-auto"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span
                    className={m.role === "Teacher" ? "text-emerald-400" : "text-cyan-400"}
                  >
                    {m.user} ({m.role})
                  </span>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </div>
                <p className="text-slate-200">{m.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Broadcast message to Grade 10B classroom..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* NOTES UPLOAD */}
      {activeToolTab === "notes" && (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Upload Class Lecture Notes</h3>
            <p className="text-xs text-slate-400 mt-1">
              Drag and drop PDF lecture notes, slide decks, or solution guides for Grade 10A & 10B.
            </p>
          </div>
          <button
            onClick={() => alert("File dialog opened for class notes upload.")}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg"
          >
            Browse PDF / Presentation Files
          </button>
        </div>
      )}

      {/* HOMEWORK MANAGER */}
      {activeToolTab === "homework" && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Assigned Homework Tracking</h3>
          <div className="space-y-2 text-xs">
            {[
              { title: "Quadratic Equation Practice #1-10", due: "Tomorrow 08:30 AM", class: "Grade 10A" },
              { title: "Synthetic Division Worksheet", due: "Friday 05:00 PM", class: "Grade 10B" },
            ].map((hw, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-200">{hw.title}</div>
                  <div className="text-[10px] text-slate-400">{hw.class}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px]">
                  Due: {hw.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
