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
    .setName("forward")
    .setDescription("Skips forward")
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Amount of seconds to skip forward")
        .setRequired(true)
        .setMinValue(0)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();
    const seconds = options.getInteger("seconds");

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
      await queue.seek(queue.currentTime + seconds);
      embed.setColor("Blue").setDescription(`Skipped forward ${seconds}s`);

      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
