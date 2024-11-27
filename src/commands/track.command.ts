import { SlashCommandBuilder } from "discord.js";

export const trackCommand = new SlashCommandBuilder()
  .setName("track")
  .setDescription("Track a LoL player")
  .addStringOption((option) => {
    return option
          .setName("username")
          .setDescription("LoL username (without region")
          .setRequired(true);
  });
