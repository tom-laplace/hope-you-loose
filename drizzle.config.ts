import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        // biome-ignore lint/style/noNonNullAssertion: process env vars are checked in index.ts
        url: process.env.DATABASE_URL!,
    }
});