import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import ChatbotPopup from "@/components/chatbot-popup";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <ChatbotPopup />
      <FloatingWhatsApp />
    </div>
  );
}
