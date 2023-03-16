const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the channel the user is in."),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply(
        "You need to be in a voice channel to use this command!"
      );
    }

    await interaction.reply(`Joined ${voiceChannel.name}!`);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  },
};
