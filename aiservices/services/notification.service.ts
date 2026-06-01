import { randomUUID } from "crypto";
import { query } from "../utils/db.js";

export async function createAdminNotification(input: {
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}) {
  const id = randomUUID();

  await query(
    `
      INSERT INTO notifications (
        "id",
        "audience",
        "type",
        "title",
        "body",
        "metadata",
        "adminId",
        "userId",
        "vendorId",
        "readAt",
        "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, NULL, NULL, NULL, NULL, NOW())
    `,
    [id, "ADMIN", "LEAD_CREATED", input.title, input.body, JSON.stringify(input.metadata)]
  );

  return id;
}