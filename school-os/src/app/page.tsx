"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

const Background = dynamic(
  () => import("@/components/Background").then((mod) => mod.Background),
  { ssr: false }
);

const TrustMarquee = dynamic(
  () => import("@/components/TrustMarquee").then((mod) => mod.TrustMarquee),
  { ssr: false }
);

const Features = dynamic(
  () => import("@/components/Features").then((mod) => mod.Features),
  { ssr: false }
);

const ProductShowcase = dynamic(
  () => import("@/components/ProductShowcase").then((mod) => mod.ProductShowcase),
  { ssr: false }
);

const HowItWorks = dynamic(
  () => import("@/components/HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: false }
);

const AISection = dynamic(
  () => import("@/components/AISection").then((mod) => mod.AISection),
  { ssr: false }
);

const Analytics = dynamic(
  () => import("@/components/Analytics").then((mod) => mod.Analytics),
  { ssr: false }
);

const Testimonials = dynamic(
  () => import("@/components/Testimonials").then((mod) => mod.Testimonials),
  { ssr: false }
);

const Pricing = dynamic(
  () => import("@/components/Pricing").then((mod) => mod.Pricing),
  { ssr: false }
);

const FAQ = dynamic(
  () => import("@/components/FAQ").then((mod) => mod.FAQ),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/Footer").then((mod) => mod.Footer),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative noise-bg">
      <Background />
      <Navbar />
      <Hero />
      <TrustMarquee />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <AISection />
      <Analytics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
