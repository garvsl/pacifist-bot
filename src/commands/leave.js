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
    .setName("leave")
    .setDescription("Leaves the channel")
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
      client.distube.voices.get(interaction)?.leave();
      interaction.reply({ content: `Left the channel!` });
      const connection = getVoiceConnection(voiceChannel.guild.id);
      connection.destroy();
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
