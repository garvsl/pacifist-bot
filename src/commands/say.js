const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Replies with the text provided")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to echo back")
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message");
    await interaction.reply(message);
  },
};
