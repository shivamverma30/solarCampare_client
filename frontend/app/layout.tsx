import type { Metadata } from "next";
import type { Viewport } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Solar Compare by SAFWE ENERGY",
    template: "%s | Solar Compare by SAFWE ENERGY",
  },
  description: "Compare solar brands, estimate savings, and connect with trusted installers across India.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
      { url: "/images/safwe-logo.png", type: "image/png" },
    ],
    shortcut: ["/icon.png", "/images/safwe-logo.png"],
    apple: [{ url: "/apple-icon.png", type: "image/png" }, { url: "/images/safwe-logo.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={`${manrope.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-app text-app-fg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
