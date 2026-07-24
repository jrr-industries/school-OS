"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Students" },
  { icon: BookOpen, label: "Classes" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

export function ProductShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section id="solutions" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Beautiful <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A stunning, intuitive interface that makes school management feel effortless.
          </p>
        </ScrollReveal>

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
          className="relative mx-auto max-w-5xl"
        >
          <motion.div
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative rounded-2xl overflow-hidden border border-glass-border"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(500px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(79,70,229,0.2), transparent 50%)`,
              }}
            />

            <div className="bg-bg-surface/80 backdrop-blur-xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-text-secondary">SchoolOS Dashboard</span>
                </div>
              </div>

              <div className="flex h-[500px]">
                <div className="w-48 lg:w-56 border-r border-glass-border p-3 space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        item.active
                          ? "bg-brand-primary/15 text-brand-primary"
                          : "text-text-secondary hover:text-white"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-4 lg:p-6 space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Total Students", value: "12,847", change: "+12%", color: "#4F46E5" },
                      { label: "Teachers", value: "342", change: "+5%", color: "#7C3AED" },
                      { label: "Attendance", value: "96.4%", change: "+2.1%", color: "#10B981" },
                      { label: "Revenue", value: "$284K", change: "+18%", color: "#06B6D4" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="glass-card rounded-xl p-3 lg:p-4"
                      >
                        <div className="text-xs text-text-secondary mb-1">{stat.label}</div>
                        <div className="text-lg lg:text-xl font-bold">{stat.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: stat.color }}>
                          {stat.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
                    <div className="glass-card rounded-xl p-4 h-52 relative overflow-hidden">
                      <div className="text-sm font-medium mb-3">Attendance Overview</div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-32">
                        {[75, 85, 70, 90, 65, 95, 80].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="flex-1 rounded-t-md"
                            style={{
                              background: `linear-gradient(to top, #4F46E5, #7C3AED)`,
                              opacity: 0.7,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="glass-card rounded-xl p-4 h-52 relative overflow-hidden">
                      <div className="text-sm font-medium mb-3">Grade Distribution</div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 h-32">
                        {[
                          { h: 40, color: "#EF4444", label: "F" },
                          { h: 55, color: "#F59E0B", label: "D" },
                          { h: 70, color: "#06B6D4", label: "C" },
                          { h: 85, color: "#4F46E5", label: "B" },
                          { h: 95, color: "#10B981", label: "A" },
                        ].map((bar, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${bar.h}%` }}
                            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                            className="flex-1 rounded-t-md"
                            style={{ background: bar.color, opacity: 0.8 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div
            className="absolute -inset-0.5 rounded-2xl opacity-30 pointer-events-none blur-xl"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #4F46E5, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
