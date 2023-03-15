const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a member from the server"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
