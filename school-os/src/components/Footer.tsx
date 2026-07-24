"use client";

import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Globe,
  Share2,
  Video,
  Code2,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Solutions: ["K-12 Schools", "Colleges", "School Districts", "Online Schools", "Tutoring Centers"],
  Resources: ["Documentation", "API Reference", "Blog", "Webinars", "Case Studies"],
  Company: ["About Us", "Careers", "Press", "Contact", "Partners"],
};

const socialLinks = [
  { icon: Share2, href: "#", label: "Twitter" },
  { icon: Globe, href: "#", label: "LinkedIn" },
  { icon: Video, href: "#", label: "YouTube" },
  { icon: Code2, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-16">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  School<span className="gradient-text">OS</span>
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-sm">
                The modern, AI-powered school management platform trusted by thousands of educational institutions worldwide.
              </p>
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-primary" />
                  hello@schoolos.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-primary" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  San Francisco, CA
                </div>
              </div>
            </ScrollReveal>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <ScrollReveal>
                <h4 className="font-semibold mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-text-secondary hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-glass-border">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.08] transition-all"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  Subscribe to our newsletter
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="px-4 py-2.5 rounded-xl bg-glass border border-glass-border text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors w-48 lg:w-56"
                  />
                  <button className="p-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-text-secondary text-center lg:text-right">
                <p>&copy; {new Date().getFullYear()} SchoolOS. All rights reserved.</p>
                <div className="flex items-center gap-4 mt-1 justify-center lg:justify-end">
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
