import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const { DISCORD_BOT_TOKEN, DISCORD_APP_CLIENT_ID, DATABASE_URL, RIOT_API_KEY } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_APP_CLIENT_ID || !DATABASE_URL || !RIOT_API_KEY) {
  throw new Error("Missing environment variables");
}

const db = drizzle(DATABASE_URL);
