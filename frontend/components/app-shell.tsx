"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import ChatbotPopup from "@/components/chatbot-popup";
import { LocaleProvider } from "@/components/locale-provider";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isHomePage = pathname === "/";

  if (isAdminRoute) {
    return <div className="relative min-h-screen flex flex-col overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <LocaleProvider>
        <Navbar key={pathname} />
        <main className={isHomePage ? "pt-0 flex-1" : "pt-24 flex-1"}>{children}</main>
        <Footer />
        <ChatbotPopup />
        <FloatingWhatsApp />
      </LocaleProvider>
    </div>
  );
}
