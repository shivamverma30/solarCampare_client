"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import ChatbotPopup from "@/components/chatbot-popup";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isHomePage = pathname === "/";

  if (isAdminRoute) {
    return <div className="relative min-h-screen overflow-x-clip">{children}</div>;
  }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <main className={isHomePage ? "pt-0" : "pt-24"}>{children}</main>
      <Footer />
      <ChatbotPopup />
      <FloatingWhatsApp />
    </div>
  );
}
