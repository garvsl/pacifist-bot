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
    .setName("filter")
    .setDescription("Puts a filter on the song")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Select an option.")
        .setRequired(true)
        .addChoices(
          { name: "none", value: "none" },
          { name: "3d", value: "3d" },
          { name: "bassboost", value: "bassboost" },
          { name: "echo", value: "echo" },
          { name: "karaoke", value: "karaoke" },
          { name: "nightcore", value: "nightcore" },
          { name: "vaporwave", value: "vaporwave" }
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
      const queue = client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed.setColor("Red").setDescription("Nothing playing right now!");

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (option == "none") {
        queue.filters.clear();
        const filter = queue.filters.names.join(", ") || "Off";
        embed
          .setColor("Green")
          .setDescription(`Current queue filter: ${filter}`);

        return interaction.reply({ embeds: [embed], ephemeral: false });
      }

      queue.filters.add(option, true);
      const filter = queue.filters.names.join(", ") || "Off";

      embed.setColor("Green").setDescription(`Current queue filter: ${filter}`);

      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
