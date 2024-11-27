import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  TextChannel,
} from "discord.js";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  getMatchDetails,
  getPuuid,
  getUserMatchesByPuuid,
} from "./api/riot.api";
import { gamesTable, usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { trackCommand } from "./commands/track.command";

const { DISCORD_BOT_TOKEN, DISCORD_APP_CLIENT_ID, DATABASE_URL, RIOT_API_KEY } =
  process.env;

if (
  !DISCORD_BOT_TOKEN ||
  !DISCORD_APP_CLIENT_ID ||
  !DATABASE_URL ||
  !RIOT_API_KEY
) {
  throw new Error("Missing environment variables");
}

const db = drizzle(DATABASE_URL);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

client.once("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "track") {
    const username = interaction.options.getString("username", true);

    try {
      const puuid = await getPuuid(username, RIOT_API_KEY);

      await db
        .insert(usersTable)
        .values({
          riot_username: username,
          riot_puiid: puuid,
        })
        .onConflictDoNothing();

      await interaction.reply(`Tracking ${username}`);
    } catch (e) {
      await interaction.reply(
        `Failed to track user ${username}, please check the username and try again`
      );
      console.error(`Failed to track user ${username}: ${e}`);
    }
  }
});

async function checkNewGames() {
  const users = await db.select().from(usersTable);
  const guilds = client.guilds.cache;

  for (const user of users) {
    // biome-ignore lint/style/noNonNullAssertion: Var is checked in the if statement
    const matches = await getUserMatchesByPuuid(user.riot_puiid, RIOT_API_KEY!);
    const latestMatch = matches[0];

    const existingGame = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.game_id, latestMatch))
      .limit(1);

    if (existingGame.length === 0) {
      // biome-ignore lint/style/noNonNullAssertion: Var is checked in the if statement
      const matchDetails = await getMatchDetails(latestMatch, RIOT_API_KEY!);
      const participant = matchDetails.info.participants.find(
        (p) => p.puuid === user.riot_puiid
      );

      if (!participant) {
        console.error(
          `Could not find participant for user ${user.riot_username}`
        );
        return;
      }

      await db.insert(gamesTable).values({
        game_id: latestMatch,
        player_id: user.riot_puiid,
        win: participant.win,
        deaths: participant.deaths,
        assists: participant.assists,
        kills: participant.kills,
      });

      // biome-ignore lint/complexity/noForEach: This is a simple forEach loop
      guilds.forEach((guild) => {
        const generalChannel = guild.channels.cache.find(
          (channel) =>
            channel.name === "general" && channel instanceof TextChannel
        ) as TextChannel;

        if (generalChannel) {
          generalChannel.send(
            `${user.riot_username} ${participant.win ? "won" : "lost"} with ${
              participant.kills
            }/${participant.deaths}/${participant.assists}`
          );
        }
      });
    }
  }
}

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: Var is checked in the if statement
  await rest.put(Routes.applicationCommands(DISCORD_APP_CLIENT_ID!), {
    body: [trackCommand.toJSON()],
  });

  client.login(DISCORD_BOT_TOKEN);

  setInterval(checkNewGames, 30 * 60 * 1000);
}

main();
