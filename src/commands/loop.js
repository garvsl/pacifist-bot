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
    .setName("loop")
    .setDescription("Loop the song or queue")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Select an option.")
        .setRequired(true)
        .addChoices(
          { name: "off", value: "0" },
          { name: "current song", value: "1" },
          { name: "the queue", value: "2" }
        )
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();
    const option = options.getString("options");

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
      const mode = client.distube.setRepeatMode(voiceChannel, parseInt(option));
      embed
        .setColor("Red")
        .setDescription(
          `Set repeat mode to \`${
            mode ? (mode === 2 ? "All Queue" : "This Song") : "Off"
          }\``
        );
      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
