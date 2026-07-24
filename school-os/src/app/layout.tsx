import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SchoolOS - AI-Powered School Management Platform",
  description:
    "Modern, intelligent school management platform powered by AI. Streamline operations, enhance learning, and connect your entire school community.",
  keywords: [
    "school management",
    "education",
    "AI",
    "SaaS",
    "school",
    "management system",
  ],
  openGraph: {
    title: "SchoolOS - AI-Powered School Management Platform",
    description:
      "Modern, intelligent school management platform powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-bg-primary text-text-primary">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
