import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riot_username: varchar().unique().notNull(),
    riot_puiid: varchar().unique().notNull(),
})