export function buildLeadNotificationTemplate(input: {
  name: string;
  phone: string;
  city: string;
  question: string;
}) {
  return {
    title: "New AI Chat Lead Received",
    body: [
      `User: ${input.name}`,
      `Phone: ${input.phone}`,
      `City: ${input.city}`,
      `Question: ${input.question}`,
      "Source: AI Chat Assistant",
      "Status: New Lead",
    ].join("\n"),
  };
}