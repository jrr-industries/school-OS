import React, { useState } from "react";
import { CommunicationMessage } from "../types";
import { communicationMessagesList } from "../data/mockData";
import { MessageSquare, Send, Search, CheckCheck } from "lucide-react";

export const CommunicationModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<
    "Teacher Messages" | "Parent Messages" | "Principal Notices" | "Student Queries"
  >("Parent Messages");

  const [selectedMsg, setSelectedMsg] = useState<CommunicationMessage>(
    communicationMessagesList[1]
  );
  const [replyText, setReplyText] = useState("");

  const filteredMessages = communicationMessagesList.filter(
    (m) => m.category === activeCategory
  );

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    alert(`Reply sent to ${selectedMsg.senderName}: "${replyText}"`);
    setReplyText("");
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare size={20} className="text-rose-400" />
          SchoolOS Communication Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Direct messaging with parents, faculty colleagues, principal notices, and student academic queries.
        </p>
      </div>

      {/* Category Tabs (Section 10 Requirement) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {[
          "Parent Messages",
          "Teacher Messages",
          "Principal Notices",
          "Student Queries",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: Message Roster & Thread Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Roster */}
        <div className="md:col-span-5 space-y-2">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMsg(msg)}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-1.5 ${
                selectedMsg.id === msg.id
                  ? "bg-slate-800 border-rose-500/50 text-slate-100 shadow-lg"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center font-bold">
                    {msg.avatar}
                  </span>
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>
              <div className="font-semibold text-slate-200 truncate">{msg.subject}</div>
              <div className="text-slate-400 text-[11px] line-clamp-1">{msg.preview}</div>
            </div>
          ))}
        </div>

        {/* Right Active Conversation View */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  {selectedMsg.subject}
                </h3>
                <div className="text-xs text-rose-400 font-semibold mt-0.5">
                  From: {selectedMsg.senderName} ({selectedMsg.senderRole})
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {selectedMsg.timestamp}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mt-4 leading-relaxed whitespace-pre-line">
              {selectedMsg.preview}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write response to ${selectedMsg.senderName}...`}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
              >
                <Send size={14} /> Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
