import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riot_username: varchar().unique().notNull(),
    riot_puiid: varchar().unique().notNull(),
})

export const gamesTable = pgTable("games", {
    game_id: varchar().notNull(),
    player_id: varchar().references(() => usersTable.riot_puiid).notNull(),
    win: boolean().notNull(),
    deaths: integer().notNull(),
    assists: integer().notNull(),
    kills: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})