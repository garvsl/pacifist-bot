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
    .setName("playlink")
    .setDescription("Plays a discord link")
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName("song").setDescription("Provide url.").setRequired(true)
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
      const reply = await interaction.reply({
        content: `Now playing 🎶`,
        fetchReply: true,
      });

      if (song.includes("discord")) {
        const player = createAudioPlayer();
        const connection = joinVoiceChannel({
          channelId: member.voice.channel.id,
          guildId: member.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        connection.subscribe(player);

        const resource = createAudioResource(`${song}`);
        player.play(resource);
      }
    } catch (e) {
      console.log(e);
      embed.setColor("RED").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
