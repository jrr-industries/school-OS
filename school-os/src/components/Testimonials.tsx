"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Principal, Westfield Academy",
    avatar: "SM",
    content:
      "SchoolOS transformed how we run our school. The AI attendance system alone saved us 15 hours per week. The analytics help us make real-time decisions.",
    rating: 5,
    color: "#4F46E5",
  },
  {
    name: "James Rodriguez",
    role: "IT Director, Riverside Schools",
    avatar: "JR",
    content:
      "The most intuitive school management system we've ever used. Teachers adopted it within days, not weeks. The API integrations are fantastic.",
    rating: 5,
    color: "#7C3AED",
  },
  {
    name: "Priya Sharma",
    role: "Academic Coordinator, Oakridge",
    avatar: "PS",
    content:
      "The AI lesson planner saves me hours every day. Exam management and report generation happen with a single click. Absolutely game-changing.",
    rating: 5,
    color: "#06B6D4",
  },
  {
    name: "Michael Chen",
    role: "Superintendent, North Valley District",
    avatar: "MC",
    content:
      "Managing 12 schools was a nightmare before SchoolOS. Now I have real-time visibility into every campus from one dashboard. Incredible ROI.",
    rating: 5,
    color: "#10B981",
  },
  {
    name: "Emily Watson",
    role: "Head Teacher, St. Mary's School",
    avatar: "EW",
    content:
      "Parent communication has never been easier. Automated notifications, instant messaging, and the parent portal have transformed engagement.",
    rating: 5,
    color: "#F59E0B",
  },
  {
    name: "David Park",
    role: "CFO, Horizon Education Group",
    avatar: "DP",
    content:
      "The finance module alone justified our investment. Automated fee collection, payroll, and compliance reporting saved us $40K in admin costs.",
    rating: 5,
    color: "#EF4444",
  },
];

function TestimonialCard({
  name,
  role,
  avatar,
  content,
  rating,
  color,
}: (typeof testimonials)[0]) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 w-[380px] shrink-0 hover:bg-white/[0.06] cursor-pointer"
    >
      <Quote
        className="w-8 h-8 mb-3 opacity-20"
        style={{ color }}
      />
      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-4">
        {content}
      </p>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-current"
            style={{ color }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: color }}
        >
          {avatar}
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-text-secondary">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Trusted by{" "}
            <span className="gradient-text">Educators</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            See why thousands of schools around the world choose SchoolOS.
          </p>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="flex gap-4 animate-marquee">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <div className="flex gap-4 animate-marquee-reverse">
            {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map((t, i) => (
              <TestimonialCard key={`r-${t.name}-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
