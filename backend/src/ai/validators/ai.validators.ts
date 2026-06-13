function isString(value: unknown): value is string {
  return typeof value === "string";
}

function buildValidationResult<T>(success: boolean, data?: T, message?: string) {
  return success ? { success: true as const, data: data as T } : { success: false as const, error: { issues: [{ message: message || "Validation failed" }] } };
}

export const messageSchema = {
  safeParse(input: unknown) {
    const payload = input as Record<string, unknown>;
    const message = payload?.message;

    if (!isString(message) || !message.trim()) {
      return buildValidationResult(false, undefined, "Message is required");
    }

    if (message.trim().length > 1000) {
      return buildValidationResult(false, undefined, "Message must be 1000 characters or less");
    }

    const conversationId = payload?.conversationId;
    if (conversationId !== undefined && !isString(conversationId)) {
      return buildValidationResult(false, undefined, "conversationId must be a string");
    }

    return buildValidationResult(true, {
      message: message.trim(),
      conversationId: isString(conversationId) ? conversationId.trim() || undefined : undefined,
      name: isString(payload?.name) ? payload.name.trim() || undefined : undefined,
      email: isString(payload?.email) ? payload.email.trim() || undefined : undefined,
      phone: isString(payload?.phone) ? payload.phone.trim() || undefined : undefined,
      city: isString(payload?.city) ? payload.city.trim() || undefined : undefined,
    });
  },
};

export const leadSchema = {
  safeParse(input: unknown) {
    const payload = input as Record<string, unknown>;
    const requiredFields = ["name", "email", "phone", "city", "question"] as const;

    for (const field of requiredFields) {
      if (!isString(payload?.[field]) || !payload[field]?.trim()) {
        return buildValidationResult(false, undefined, `${field} is required`);
      }
    }

    if (String(payload.question).trim().length > 1000) {
      return buildValidationResult(false, undefined, "question must be 1000 characters or less");
    }

    if (payload.conversationId !== undefined && !isString(payload.conversationId)) {
      return buildValidationResult(false, undefined, "conversationId must be a string");
    }

    return buildValidationResult(true, {
      conversationId: isString(payload.conversationId) ? payload.conversationId.trim() || undefined : undefined,
      name: String(payload.name).trim(),
      email: String(payload.email).trim(),
      phone: String(payload.phone).trim(),
      city: String(payload.city).trim(),
      question: String(payload.question).trim(),
    });
  },
};
