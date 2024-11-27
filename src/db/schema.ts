import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    riot_username: varchar().unique().notNull(),
    riot_puiid: varchar().unique().notNull(),
})

export const gamesTable = pgTable("games", {
    game_id: integer().notNull(),
    player_id: varchar().references(() => usersTable.riot_puiid).notNull(),
    result: boolean().notNull(),
    deaths: integer().notNull(),
    assists: integer().notNull(),
    kills: integer().notNull(),
})