import { Pool, type QueryResultRow } from "pg";
import { getEnv } from "../config/env.js";

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    const env = getEnv();
    pool = new Pool({ connectionString: env.DATABASE_URL });
  }

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const client = await getPool().connect();

  try {
    const result = await client.query<T>(text, params);
    return result;
  } finally {
    client.release();
  }
}