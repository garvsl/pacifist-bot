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
    .setName("queue")
    .setDescription("Displays the current queue")
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
        embed.setColor("Red").setDescription("Nothing playing right now!");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      embed.setColor("Purple").setDescription(
        `Current queue:\n${queue.songs
          .map(
            (song, id) =>
              `**${id ? id : "Playing"}**. ${song.name} - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 10)
          .join("\n")}`
      );

      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
