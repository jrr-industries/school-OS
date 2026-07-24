"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const faqs = [
  {
    question: "How long does it take to set up SchoolOS?",
    answer:
      "Most schools are fully set up within 48 hours. Our onboarding team helps migrate your data, configure your instance, and train your staff. You can start using the basic features immediately after sign-up.",
  },
  {
    question: "Is my school data secure?",
    answer:
      "Absolutely. SchoolOS uses enterprise-grade encryption (AES-256), SOC 2 compliant infrastructure, and regular security audits. All data is encrypted at rest and in transit. We are GDPR, FERPA, and COPPA compliant.",
  },
  {
    question: "Can SchoolOS integrate with our existing systems?",
    answer:
      "Yes. SchoolOS offers a comprehensive REST API, webhooks, and pre-built integrations with popular SIS, LMS, and payment gateways. Our team can build custom integrations for your specific needs.",
  },
  {
    question: "Do you offer training for teachers and staff?",
    answer:
      "Yes. We provide live onboarding sessions, video tutorials, detailed documentation, and a dedicated support team. Teachers typically become proficient within a single training session thanks to our intuitive interface.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial with full access to all features. No credit card required. You can upgrade, downgrade, or cancel anytime.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support with a 4-hour response time. Professional plans get priority support (1-hour response), and Enterprise plans receive a dedicated account manager and 24/7 premium support.",
  },
  {
    question: "Can I manage multiple school campuses?",
    answer:
      "Yes. SchoolOS supports multi-campus management with centralized administration. You can manage all campuses from a single dashboard while maintaining separate configurations, data, and permissions per campus.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes. SchoolOS has native mobile apps for iOS and Android. Teachers can mark attendance, send notifications, and access student data on the go. Parents and students also get dedicated mobile apps.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-glass-border last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium pr-4 group-hover:text-white transition-colors">
          {question}
        </span>
        <span className="shrink-0 w-8 h-8 rounded-lg glass-card flex items-center justify-center text-text-secondary group-hover:text-white group-hover:border-white/20 transition-all">
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-text-secondary leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Everything you need to know about SchoolOS.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="glass-card rounded-2xl p-6 lg:p-8">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
