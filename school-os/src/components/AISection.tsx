"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Brain, Zap, MessageSquare, Wand2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const messages = [
  "Generate a lesson plan for Grade 10 Mathematics - Quadratic Equations...",
  "Analyze the attendance data for Class 8B this month...",
  "Create a progress report template for parent-teacher meetings...",
  "Suggest personalized learning resources for struggling students...",
];

const capabilities = [
  {
    icon: Brain,
    title: "Intelligent Insights",
    description: "AI analyzes student data to identify learning gaps and suggest interventions.",
    color: "#4F46E5",
  },
  {
    icon: Zap,
    title: "Instant Automation",
    description: "Automate grading, report generation, timetable creation, and more.",
    color: "#7C3AED",
  },
  {
    icon: MessageSquare,
    title: "Natural Language",
    description: "Chat with SchoolOS in plain English. No training required for anyone.",
    color: "#06B6D4",
  },
  {
    icon: Wand2,
    title: "Smart Content",
    description: "Generate quizzes, worksheets, and learning materials tailored to your curriculum.",
    color: "#10B981",
  },
];

export function AISection() {
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const current = messages[typingIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && typedText.length < current.length) {
      timeout = setTimeout(
        () => setTypedText(current.slice(0, typedText.length + 1)),
        40 + Math.random() * 50
      );
    } else if (!isDeleting && typedText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(
        () => setTypedText(current.slice(0, typedText.length - 1)),
        20
      );
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % messages.length);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, typingIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.length = 0;
      for (let i = 0; i < 40; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          connections: [],
        });
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 150) {
            nodes[i].connections.push(j);
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = canvas!.width;
        if (node.x > canvas!.width) node.x = 0;
        if (node.y < 0) node.y = canvas!.height;
        if (node.y > canvas!.height) node.y = 0;
      }

      for (const node of nodes) {
        for (const j of node.connections) {
          const target = nodes[j];
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          ctx!.beginPath();
          ctx!.moveTo(node.x, node.y);
          ctx!.lineTo(target.x, target.y);
          ctx!.strokeStyle = `rgba(79, 70, 229, ${0.08 * (1 - dist / 150)})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }

      for (const node of nodes) {
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(79, 70, 229, 0.4)";
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(79, 70, 229, 0.1)";
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/5 text-brand-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Meet Your{" "}
            <span className="gradient-text">AI Assistant</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A powerful AI copilot that helps teachers teach better, administrators manage smarter, and students learn faster.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-6 border-brand-primary/20">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-glass-border">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">SchoolOS AI</div>
                  <div className="text-xs text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Online
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-glass rounded-xl p-3 text-sm text-text-secondary">
                  How can I help you manage your school today?
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-glass border border-glass-border">
                <span className="text-sm text-text-secondary flex-1">
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-brand-primary ml-0.5 align-middle"
                  />
                </span>
              </div>

              <div className="flex gap-2 mt-3 flex-wrap">
                {["Lesson Plan", "Reports", "Timetable", "Analytics"].map(
                  (suggestion) => (
                    <span
                      key={suggestion}
                      className="px-3 py-1 text-xs rounded-lg border border-glass-border text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary cursor-pointer transition-colors"
                    >
                      {suggestion}
                    </span>
                  )
                )}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 hover:bg-white/[0.06] transition-colors group h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${cap.color}15`, color: cap.color }}
                  >
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold mb-2">{cap.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
