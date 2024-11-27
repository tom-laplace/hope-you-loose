import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DATABASE_URL } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DATABASE_URL) {
  throw new Error("Missing environment variables");
}

// biome-ignore lint/style/noNonNullAssertion: process env vars are checked above
const db = drizzle(process.env.DATABASE_URL!);
