"use client";

import { motion } from "framer-motion";
import { Check, Zap, Building2, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small schools getting started with digital management.",
    price: "$149",
    period: "/month",
    color: "#4F46E5",
    icon: Zap,
    popular: false,
    features: [
      "Up to 500 students",
      "Attendance management",
      "Timetable generation",
      "Basic reports",
      "Email support",
      "Parent portal",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    description: "Ideal for growing schools that need advanced features and analytics.",
    price: "$349",
    period: "/month",
    color: "#7C3AED",
    icon: Building2,
    popular: true,
    features: [
      "Up to 2,000 students",
      "Everything in Starter",
      "AI-powered analytics",
      "Exam & grading module",
      "Transport & GPS tracking",
      "Finance & fee management",
      "Priority support",
      "API access",
      "Custom workflows",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    description: "For large institutions and school districts with custom requirements.",
    price: "Custom",
    period: "",
    color: "#06B6D4",
    icon: Sparkles,
    popular: false,
    features: [
      "Unlimited students",
      "Everything in Professional",
      "Dedicated account manager",
      "On-premise deployment",
      "SSO & SAML integration",
      "Custom AI model training",
      "SLA guarantees",
      "White-label option",
      "24/7 premium support",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Start for free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`relative glass-card rounded-2xl p-8 ${
                  plan.popular
                    ? "border-brand-secondary/30 shadow-xl shadow-brand-secondary/5"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${plan.color}15`, color: plan.color }}
                >
                  <plan.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-text-secondary mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-text-secondary">{plan.period}</span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-text-secondary"
                    >
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    plan.popular
                      ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40"
                      : "glass-card border border-glass-border text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
