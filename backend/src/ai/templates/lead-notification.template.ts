import type { NotificationPriority, NotificationType } from "@prisma/client";

export function buildLeadNotificationTemplate(input: {
  name: string;
  email: string;
  phone: string;
  city: string;
  question: string;
  summary: string;
  timestamp: string;
}): { title: string; body: string; type: NotificationType; priority: NotificationPriority } {
  return {
    title: "New AI Chat Lead",
    body: [
      "Lead Details",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      `City: ${input.city}`,
      "",
      `Last Question: ${input.question}`,
      `Chat Summary: ${input.summary}`,
      "Source: AI Assistant",
      `Submitted: ${input.timestamp}`,
      "Priority: High",
    ].join("\n"),
    type: "AI_CHAT_LEAD",
    priority: "HIGH",
  };
}
