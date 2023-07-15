const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  voiceChannel,
  GuildEmoji,
} = require("discord.js");
const client = require("../client.js");

const { createAudioPlayer, createAudioResource } = require("@discordjs/voice");

const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Provide the name of the song.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const song = options.getString("song");
    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (
      member.voice.channelId != guild.members.me.voice.channelId &&
      guild.members.me.voice.channelId
    ) {
      embed
        .setColor("Red")
        .setDescription(
          `We are already chilling in <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      if (
        song.includes("youtube") ||
        song.includes("spotify") ||
        song.includes("soundcloud") ||
        !song.includes("http")
      ) {
        const message = await interaction.reply({ content: `Now playing 🎶` });
        await client.distube.play(voiceChannel, song, {
          textChannel: channel,
          member: member,
        });
      } else {
        const message = await interaction.reply({
          content: `Use command \`playlink\` to play discord links 🎶`,
        });
      }
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
