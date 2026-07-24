"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Users, Building2, GraduationCap, UserCheck } from "lucide-react";
import CountUp from "react-countup";
import { Hero3DScene } from "@/components/three/Hero3DScene";

const stats = [
  { icon: Building2, label: "Schools", value: 2500, suffix: "+" },
  { icon: Users, label: "Students", value: 500000, suffix: "+" },
  { icon: GraduationCap, label: "Teachers", value: 75000, suffix: "+" },
  { icon: UserCheck, label: "Parents", value: 1000000, suffix: "+" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  delay,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number;
  suffix: string;
  delay: number;
}) {
  const [inView, setInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onViewportEnter={() => setInView(true)}
      className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3"
    >
      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      <div>
        <div className="text-lg font-bold tracking-tight">
          {inView && (
            <CountUp end={value} duration={2.5} separator="," suffix={suffix} />
          )}
        </div>
        <div className="text-xs text-text-secondary">{label}</div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <Hero3DScene />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-brand-primary text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              Now with AI-powered automation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
            >
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span>School Management</span>
              <br />
              <span className="text-text-secondary">Platform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-text-secondary max-w-lg leading-relaxed"
            >
              Streamline every aspect of your school operations with intelligent
              automation. From attendance to analytics &mdash; SchoolOS simplifies
              it all, so you can focus on what matters most: education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold text-base shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-glass-border glass-card text-white font-semibold text-base hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {stats.map((stat, i) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                delay={1 + i * 0.1}
              />
            ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block relative h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-brand-primary/10 blur-3xl animate-pulse-glow" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
