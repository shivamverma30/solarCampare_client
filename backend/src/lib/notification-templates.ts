import type { Prisma, NotificationPriority, NotificationType } from "@prisma/client";

export type NotificationTemplate = {
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  metadata?: Prisma.InputJsonValue;
};

function formatTimestamp(timestamp: Date | string | undefined): string {
  const value = timestamp ? new Date(timestamp) : new Date();
  return value.toISOString();
}

export const notificationTemplates = {
  aiChatLead(input: { name: string; email: string; phone: string; city: string; question: string; summary: string; timestamp?: Date | string }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);

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
        `Submitted: ${timestamp}`,
        "Priority: High",
      ].join("\n"),
      type: "AI_CHAT_LEAD",
      priority: "HIGH",
      metadata: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        city: input.city,
        question: input.question,
        summary: input.summary,
        timestamp,
      },
    };
  },

  quoteRequest(input: {
    name: string;
    email: string;
    phone?: string | null;
    pincode?: string | null;
    monthlyBill?: number | null;
    roofSize?: number | null;
    recommendedCapacity?: string;
    estimatedSavings?: string;
    roi?: string;
    timestamp?: Date | string;
  }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);

    return {
      title: "New Quote Request",
      body: [
        "Lead Details",
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone || "-"}`,
        `Pincode: ${input.pincode || "-"}`,
        "",
        `Monthly Bill: ${input.monthlyBill ?? "-"}`,
        `Roof Size: ${input.roofSize ?? "-"}`,
        `Recommended Capacity: ${input.recommendedCapacity || "-"}`,
        `Estimated Savings: ${input.estimatedSavings || "-"}`,
        `ROI: ${input.roi || "-"}`,
        `Submitted: ${timestamp}`,
      ].join("\n"),
      type: "QUOTE_REQUEST",
      priority: "HIGH",
      metadata: {
        ...input,
        timestamp,
      },
    };
  },

  consultationRequest(input: {
    userName: string;
    userEmail: string;
    userPhone?: string | null;
    vendorName: string;
    businessName: string;
    vendorEmail: string;
    vendorPhone: string;
    timestamp?: Date | string;
    status?: string;
  }): { admin: NotificationTemplate; vendor: NotificationTemplate } {
    const timestamp = formatTimestamp(input.timestamp);

    return {
      admin: {
        title: "New Consultation Request",
        body: [
          "USER",
          `Name: ${input.userName}`,
          `Email: ${input.userEmail}`,
          `Phone: ${input.userPhone || "-"}`,
          "",
          "VENDOR",
          `Vendor Name: ${input.vendorName}`,
          `Business Name: ${input.businessName}`,
          `Email: ${input.vendorEmail}`,
          `Phone: ${input.vendorPhone}`,
          "",
          `Timestamp: ${timestamp}`,
          `Status: ${input.status || "NEW"}`,
        ].join("\n"),
        type: "CONSULTATION_REQUEST",
        priority: "HIGH",
        metadata: {
          ...input,
          timestamp,
        },
      },
      vendor: {
        title: "New Consultation Request",
        body: `Description: ${input.userName} is interested in discussing a solar project.`,
        type: "CONSULTATION_REQUEST",
        priority: "HIGH",
        metadata: {
          userName: input.userName,
          vendorName: input.vendorName,
          businessName: input.businessName,
          timestamp,
        },
      },
    };
  },

  userRegistered(input: { name: string; email: string; timestamp?: Date | string }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);
    return {
      title: "New User Registration",
      body: [`Name: ${input.name}`, `Email: ${input.email}`, `Submitted: ${timestamp}`].join("\n"),
      type: "USER_REGISTERED",
      priority: "MEDIUM",
      metadata: { ...input, timestamp },
    };
  },

  vendorRegistered(input: { name: string; email: string; companyName: string; timestamp?: Date | string }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);
    return {
      title: "New Vendor Registration",
      body: [`Name: ${input.name}`, `Email: ${input.email}`, `Company: ${input.companyName}`, `Submitted: ${timestamp}`].join("\n"),
      type: "VENDOR_REGISTERED",
      priority: "MEDIUM",
      metadata: { ...input, timestamp },
    };
  },

  vendorApproved(input: { companyName: string; timestamp?: Date | string }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);
    return {
      title: "Vendor Approved",
      body: [`Company: ${input.companyName}`, `Submitted: ${timestamp}`].join("\n"),
      type: "VENDOR_APPROVED",
      priority: "MEDIUM",
      metadata: { ...input, timestamp },
    };
  },

  vendorRejected(input: { companyName: string; reason?: string; timestamp?: Date | string }): NotificationTemplate {
    const timestamp = formatTimestamp(input.timestamp);
    return {
      title: "Vendor Rejected",
      body: [`Company: ${input.companyName}`, `Reason: ${input.reason || "Not provided"}`, `Submitted: ${timestamp}`].join("\n"),
      type: "VENDOR_REJECTED",
      priority: "MEDIUM",
      metadata: { ...input, timestamp },
    };
  },
} as const;