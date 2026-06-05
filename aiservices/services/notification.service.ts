import { randomUUID } from "crypto";
import { query } from "../utils/db.js";

export async function createAdminNotification(input: {
  title: string;
  body: string;
  type?: string;
  priority?: string;
  metadata: Record<string, unknown>;
}) {
  const id = randomUUID();

  await query(
    `
      INSERT INTO notifications (
        "id",
        "audience",
        "type",
        "priority",
        "title",
        "body",
        "metadata",
        "adminId",
        "userId",
        "vendorId",
        "readAt",
        "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NULL, NULL, NULL, NULL, NOW())
    `,
    [id, "ADMIN", input.type || "AI_CHAT_LEAD", input.priority || "HIGH", input.title, input.body, JSON.stringify(input.metadata)]
  );

  return id;
}