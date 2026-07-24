"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  GraduationCap,
  School,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const steps = [
  {
    icon: Building2,
    title: "Create Your School",
    description:
      "Set up your school profile, add campuses, configure academic years, and customize your SchoolOS instance in minutes.",
    color: "#4F46E5",
    details: [
      "School profile & branding",
      "Multiple campus support",
      "Academic year configuration",
      "Custom grading systems",
    ],
  },
  {
    icon: Users,
    title: "Add Your Staff",
    description:
      "Invite teachers, administrators, and support staff. Assign roles, permissions, and departments with one click.",
    color: "#7C3AED",
    details: [
      "Role-based access control",
      "Department management",
      "Bulk staff import",
      "Attendance & payroll setup",
    ],
  },
  {
    icon: GraduationCap,
    title: "Add Students",
    description:
      "Enroll students, create classes, assign sections, and set up parent accounts. Everything syncs automatically.",
    color: "#06B6D4",
    details: [
      "Student enrollment portal",
      "Class & section creation",
      "Parent account linking",
      "Document management",
    ],
  },
  {
    icon: School,
    title: "Manage Your School",
    description:
      "Run daily operations effortlessly. Track attendance, schedule exams, communicate with parents, and generate reports.",
    color: "#10B981",
    details: [
      "Daily attendance tracking",
      "Automated timetables",
      "Exam & grading module",
      "Real-time analytics",
    ],
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get your school up and running on SchoolOS in four simple steps.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.button
                key={step.title}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group ${
                  activeStep === i
                    ? "glass-card border-brand-primary/30 shadow-lg shadow-brand-primary/5"
                    : "hover:bg-white/[0.02] border border-transparent"
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeStep === i ? "opacity-100" : "opacity-50"
                    }`}
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-text-secondary">
                        Step {i + 1}
                      </span>
                      <ArrowDown
                        className={`w-3 h-3 transition-transform ${
                          activeStep === i ? "rotate-0" : "-rotate-90"
                        }`}
                        style={{ color: step.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-2xl p-8 lg:p-10 sticky top-24"
                style={{
                  borderColor: `${steps[activeStep].color}30`,
                  boxShadow: `0 0 60px ${steps[activeStep].color}05`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${steps[activeStep].color}15`,
                    color: steps[activeStep].color,
                  }}
                >
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {steps[activeStep].title}
                </h3>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3">
                  {steps[activeStep].details.map((detail, j) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * j }}
                      className="flex items-center gap-3 text-sm text-text-secondary"
                    >
                      <CheckCircle2
                        className="w-5 h-5 shrink-0"
                        style={{ color: steps[activeStep].color }}
                      />
                      {detail}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-glass-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      Step {activeStep + 1} of {steps.length}
                    </span>
                    <div className="flex gap-1.5">
                      {steps.map((s, j) => (
                        <div
                          key={j}
                          className={`w-8 h-1 rounded-full transition-all duration-300 ${
                            j <= activeStep ? "opacity-100" : "opacity-30"
                          }`}
                          style={{
                            backgroundColor: j <= activeStep ? s.color : "#ffffff20",
                            width: j === activeStep ? 24 : 8,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
