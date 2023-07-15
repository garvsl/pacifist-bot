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
    .setName("skip")
    .setDescription("Skip the curent song")
    .setDMPermission(false),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

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
      const queue = client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed.setColor("Red").setDescription("There is no active queue.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await queue.skip(voiceChannel);
      embed.setColor("Green").setDescription("Song has been skipped");
      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      const queue = client.distube.getQueue(voiceChannel);
      // console.log(e);
      await queue.stop(voiceChannel);
      embed.setColor("Green").setDescription("Song has been skipped");
      return interaction.reply({ embeds: [embed], ephemeral: false });
    }
  },
};
