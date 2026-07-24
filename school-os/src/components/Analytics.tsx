"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

interface Metric {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const metrics: Metric[] = [
  { label: "Active Students", value: 12847, suffix: "", color: "#4F46E5" },
  { label: "Avg. Attendance", value: 96.4, suffix: "%", color: "#10B981" },
  { label: "Avg. Grade", value: 87.2, suffix: "%", color: "#06B6D4" },
  { label: "Parent Satisfaction", value: 94, suffix: "%", color: "#7C3AED" },
];

function AnimatedRing({
  percentage,
  color,
  size = 100,
  strokeWidth = 6,
  label,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
}) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      <div className="text-center">
        <div className="text-lg font-bold">{percentage}%</div>
        <div className="text-xs text-text-secondary">{label}</div>
      </div>
    </div>
  );
}

function LiveChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const data: number[] = Array.from({ length: 40 }, () => 50 + Math.random() * 40);
    const colors = ["#4F46E5", "#7C3AED", "#06B6D4"];

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      data.shift();
      data.push(50 + Math.random() * 40);

      const gradient = ctx!.createLinearGradient(0, 0, 0, canvas!.height);
      gradient.addColorStop(0, "rgba(79,70,229,0.15)");
      gradient.addColorStop(1, "rgba(79,70,229,0.0)");

      const stepX = canvas!.width / (data.length - 1);
      const maxY = 100;
      const paddingY = 10;

      ctx!.beginPath();
      ctx!.moveTo(0, canvas!.height);

      for (let i = 0; i < data.length; i++) {
        const x = i * stepX;
        const y =
          canvas!.height - paddingY - (data[i] / maxY) * (canvas!.height - paddingY * 2);
        ctx!.lineTo(x, y);
      }

      ctx!.lineTo(canvas!.width, canvas!.height);
      ctx!.closePath();
      ctx!.fillStyle = gradient;
      ctx!.fill();

      ctx!.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i * stepX;
        const y =
          canvas!.height - paddingY - (data[i] / maxY) * (canvas!.height - paddingY * 2);
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = "#4F46E5";
      ctx!.lineWidth = 2;
      ctx!.shadowColor = "#4F46E5";
      ctx!.shadowBlur = 10;
      ctx!.stroke();

      ctx!.beginPath();
      const lastX = (data.length - 1) * stepX;
      const lastY =
        canvas!.height - paddingY - (data[data.length - 1] / maxY) * (canvas!.height - paddingY * 2);
      ctx!.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx!.fillStyle = "#4F46E5";
      ctx!.shadowColor = "#4F46E5";
      ctx!.shadowBlur = 15;
      ctx!.fill();

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-48"
    />
  );
}

export function Analytics() {
  const [inView, setInView] = useState(false);

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Real-Time <span className="gradient-text">Analytics</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Make data-driven decisions with beautiful, real-time dashboards and reports.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <ScrollReveal className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6" onMouseEnter={() => setInView(true)}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Performance Trends</h3>
                <div className="flex items-center gap-3 text-xs">
                  {["Daily", "Weekly", "Monthly"].map((period) => (
                    <span
                      key={period}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                        period === "Daily"
                          ? "bg-brand-primary/15 text-brand-primary"
                          : "text-text-secondary hover:text-white"
                      }`}
                    >
                      {period}
                    </span>
                  ))}
                </div>
              </div>
              <LiveChart />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {metrics.slice(0, 3).map((metric) => (
                  <div key={metric.label}>
                    <div className="text-xs text-text-secondary">{metric.label}</div>
                    <div className="text-xl font-bold" style={{ color: metric.color }}>
                      {metric.value.toLocaleString()}
                      {metric.suffix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            <ScrollReveal delay={0.1}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-6">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <AnimatedRing percentage={96} color="#10B981" size={80} strokeWidth={5} label="Attendance" />
                  <AnimatedRing percentage={87} color="#4F46E5" size={80} strokeWidth={5} label="Avg Grade" />
                  <AnimatedRing percentage={94} color="#7C3AED" size={80} strokeWidth={5} label="Satisfaction" />
                  <AnimatedRing percentage={92} color="#06B6D4" size={80} strokeWidth={5} label="Completion" />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between py-2 border-b border-glass-border last:border-0"
                  >
                    <span className="text-sm text-text-secondary">{metric.label}</span>
                    <span className="text-sm font-semibold" style={{ color: metric.color }}>
                      {metric.value.toLocaleString()}
                      {metric.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
