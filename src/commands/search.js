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
    .setName("search")
    .setDescription("Searches for a song")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song to search for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();
    const song = options.getString("song");

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
      const searched = await client.distube.search(song);
      let i = 0;
      embed
        .setColor("Blue")
        .setDescription(
          `**Choose an option from below**\n${searched
            .map(
              (song) =>
                `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
            )
            .join(
              "\n"
            )}\n*Select a number to play or wait 30 seconds to cancel*`
        );
      const message = await interaction.reply({
        embeds: [embed],
        ephemeral: false,
        fetchReply: true,
      });

      message.react("1️⃣");
      message.react("2️⃣");
      message.react("3️⃣");
      message.react("4️⃣");
      message.react("5️⃣");
      message.react("6️⃣");
      message.react("7️⃣");
      message.react("8️⃣");
      message.react("9️⃣");
      message.react("🔟");

      const collectorFilter = (reaction, user) => {
        return (
          // ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].includes(
          //   reaction.emoji.name
          // ) &&
          user.id === interaction.user.id
        );
      };

      message
        .awaitReactions({
          filter: collectorFilter,
          max: 1,
          time: 30000,
          errors: ["time"],
        })
        .then((collected) => {
          const reaction = collected.first();

          console.log(reaction);
          console.log("hello");
          //           await client.distube.play(voiceChannel, song, {
          //   textChannel: channel,
          //   member: member,
          // });

          // return interaction.reply({ embeds: [embed], ephemeral: false });
        })
        .catch((collected) => {
          message.reply("You didnt react.");
        });
    } catch (e) {
      console.log(e);
      embed.setColor("Red").setDescription("There is an error!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
