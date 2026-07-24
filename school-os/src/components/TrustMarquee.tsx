"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

const logos = [
  { name: "Harvard", letter: "H" },
  { name: "Stanford", letter: "S" },
  { name: "MIT", letter: "M" },
  { name: "Oxford", letter: "O" },
  { name: "Cambridge", letter: "C" },
  { name: "Yale", letter: "Y" },
  { name: "Princeton", letter: "P" },
  { name: "Columbia", letter: "C" },
  { name: "Berkeley", letter: "B" },
  { name: "NYU", letter: "N" },
  { name: "UCLA", letter: "U" },
  { name: "Duke", letter: "D" },
];

export function TrustMarquee() {
  return (
    <section className="py-16 overflow-hidden border-y border-glass-border">
      <ScrollReveal className="text-center mb-10">
        <p className="text-sm text-text-secondary tracking-widest uppercase">
          Trusted by leading schools and institutions worldwide
        </p>
      </ScrollReveal>

      <div className="relative">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <motion.div
            className="flex gap-8 animate-marquee"
            style={{ minWidth: "200%" }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-3 px-6 py-3 glass-card rounded-xl min-w-fit hover:bg-white/8 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-white font-bold text-sm">
                  {logo.letter}
                </div>
                <span className="text-sm text-text-secondary whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
