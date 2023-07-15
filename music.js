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
    .setName("music")
    .setDescription("The music system.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) =>
          option
            .setName("song")
            .setDescription("Provide the name or url of the song.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("Adjust volume level")
        .addIntegerOption((option) =>
          option
            .setName("percent")
            .setDescription("Provide the percentage (1-100).")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("options")
        .setDescription("Select an option")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "queue", value: "queue" },
              { name: "skip", value: "skip" },
              { name: "pause", value: "pause" },
              { name: "resume", value: "resume" },
              { name: "stop", value: "stop" },
              { name: "shuffle", value: "shuffle" }
            )
        )
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const subcommand = options.getSubcommand();
    const song = options.getString("song");
    const volume = options.getInteger("percent");
    const option = options.getString("options");

    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (
      member.voice.channelId != guild.members.me.voice.channelId &&
      guild.members.me.voice.channelId
    ) {
      embed
        .setColor("Red")
        .setDescription(
          `The music player is being used in <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      
      switch (subcommand) {
        case "play":
          client.distube.play(voiceChannel, song, {
            textChannel: channel,
            member: member,
          });
          return interaction.reply({ content: `Now playing ${song}` });
        case "volume":
          client.distube.setVolume(voiceChannel, volume);
          return interaction.reply({
            content: `Volume has been set to ${volume}`,
          });
        case "options":
          const queue = client.distube.getQueue(voiceChannel);

          if (!queue) {
            embed.setColor("Red").setDescription("There is no active queue.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          switch (option) {
        case "skip":
          await queue.skip(voiceChannel)
          embed.setColor("Green").setDescription("Song has been skipped");
          return interaction.reply({ embeds: [embed], ephemeral: false });

        case "stop":
          await queue.stop(voiceChannel)
          embed.setColor("Green").setDescription("Song has been stopped");
          return interaction.reply({ embeds: [embed], ephemeral: false });

        case "pause":
          await queue.pause(voiceChannel)
          embed.setColor("Green").setDescription("Song has been paused");
          return interaction.reply({ embeds: [embed], ephemeral: false });

        case "resume":
          await queue.resume(voiceChannel)
          embed.setColor("Green").setDescription("Song has been resumed");
          return interaction.reply({ embeds: [embed], ephemeral: false });

        case "queue":
          embed
            .setColor("Purple")
            .setDescription(
              `${queue.songs.map(
                (song, id) =>
                  `\n**${id + 1}** ${song.name} -\`${song.formattedDuration}\``
              )}`
            );
          return interaction.reply({ embeds: [embed], ephemeral: false });
        case "shuffle":
          await queue.shuffle(voiceChannel)
          embed.setColor("Green").setDescription("Playlist has been shufled");
          return interaction.reply({ embeds: [embed], ephemeral: false });
      }
      }
      
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("Error");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
