const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  voiceChannel,
  GuildEmoji,
} = require("discord.js");
const client = require("../client.js");

const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the bot's volume")
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("percent")
        .setDescription("Provide the percentage (1-100).")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const volume = options.getInteger("percent");
    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (
      member.voice.channelId != guild.members.me.voice.channelId &&
      guild.members.me.voice.channelId
    ) {
      embed
        .setColor("Red")
        .setDescription(
          `We are chilling in <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      interaction.reply({ content: `Volume is now ${volume} 🔊` });
      client.distube.setVolume(voiceChannel, volume);
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
