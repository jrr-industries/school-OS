"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Calendar,
  BookOpen,
  MessageSquare,
  Bus,
  Wallet,
  BarChart3,
  Library,
  FileText,
  ClipboardList,
  Bot,
  Bell,
  GraduationCap,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const features = [
  {
    icon: ClipboardCheck,
    title: "Smart Attendance",
    description: "AI-powered face recognition and RFID attendance tracking with real-time parent notifications.",
    color: "#4F46E5",
    size: "col-span-1",
  },
  {
    icon: Calendar,
    title: "Dynamic Timetable",
    description: "Auto-generate conflict-free timetables. Handle substitutions, room changes, and special schedules effortlessly.",
    color: "#7C3AED",
    size: "col-span-1",
  },
  {
    icon: BookOpen,
    title: "Exam Management",
    description: "Create, schedule, and grade exams. Generate report cards, analyze performance, and track student progress.",
    color: "#06B6D4",
    size: "col-span-2",
  },
  {
    icon: MessageSquare,
    title: "Unified Communication",
    description: "Built-in messaging, announcements, and parent-teacher chat. Keep everyone connected in one place.",
    color: "#10B981",
    size: "col-span-2",
  },
  {
    icon: Bus,
    title: "Transport & GPS",
    description: "Live bus tracking, route optimization, and automated parent alerts for student safety.",
    color: "#F59E0B",
    size: "col-span-1",
  },
  {
    icon: Wallet,
    title: "Fee & Finance",
    description: "Automated fee collection, expense tracking, payroll, and financial reporting with compliance.",
    color: "#EF4444",
    size: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time dashboards, heat maps, and predictive insights for data-driven decisions.",
    color: "#4F46E5",
    size: "col-span-1",
  },
  {
    icon: Library,
    title: "Digital Library",
    description: "Complete library management with barcode scanning, online catalog, and automated fines.",
    color: "#7C3AED",
    size: "col-span-1",
  },
  {
    icon: Bot,
    title: "AI Teaching Assistant",
    description: "24/7 AI assistant for lesson planning, grading support, and personalized learning recommendations.",
    color: "#06B6D4",
    size: "col-span-1",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Push, SMS, email, and in-app notifications with intelligent scheduling and priority routing.",
    color: "#10B981",
    size: "col-span-1",
  },
];

function BentoCard({
  icon: Icon,
  title,
  description,
  color,
  size,
}: (typeof features)[0]) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative glass-card rounded-2xl p-6 lg:p-8 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ${size}`}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${color}08, transparent 40%)`,
        }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-white/90 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-secondary/80 transition-colors">
        {description}
      </p>
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="gradient-text">Powerful</span> Features
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Everything you need to run your school efficiently. All in one beautifully designed platform.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.05}>
              <BentoCard {...feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
