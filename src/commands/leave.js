const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the channel it is in."),
  async execute(interaction) {
    //It has problems leaving when ur not in a channel, and also when its not in a channel
    const connection = getVoiceConnection(
      interaction.member.voice.channel.guild.id
    );

    if (interaction.member.voice.channel.guild) {
      return await interaction.reply("Youre not in a voice channel");
    }
    if (connection) {
      connection.destroy();
      await interaction.reply("Left the voice channel");
    } else {
      await interaction.reply("I'm not in a voice channel");
    }
  },
};
