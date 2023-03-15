const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          title: `${interaction.guild.name}`,
          description: `${interaction.guild.memberCount} members.`,
          color: "2",
        },
      ],
      ephemeral: true,
    });
  },
};
