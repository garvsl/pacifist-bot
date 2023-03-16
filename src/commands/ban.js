const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.options.getMember("target");

    const yes = new ButtonBuilder()
      .setCustomId("yesSucces")
      .setLabel("Yes!")
      .setStyle(ButtonStyle.Success);

    const no = new ButtonBuilder()
      .setCustomId("noDanger")
      .setLabel("No!")
      .setStyle(ButtonStyle.Danger);

    const yesNo = new ActionRowBuilder().addComponents(yes, no);

    if (!member) {
      await interaction.reply({
        content: "Member does not exist!",
        ephemeral: true,
      });
      return;
    }

    if (member.id === interaction.user.id) {
      return await interaction.reply({
        content: "You cannot ban yourself!",
        ephemeral: true,
      });
    }

    const authorHighestRole = interaction.member.roles.highest;
    const targetHighestRole = member.roles.highest;
    const botHighestRole = interaction.guild.members.me.roles.highest;

    if (targetHighestRole.position >= authorHighestRole.position) {
      return await interaction.reply({
        content: "You do not have sufficient permissions to ban this member!",
        ephemeral: true,
      });
    }

    if (targetHighestRole.position >= botHighestRole.position) {
      return await interaction.reply({
        content:
          "I cant ban that user--they have the same/higher role than me!",
        ephemeral: true,
      });
    }

    try {
      const banMessage = await interaction.reply({
        embeds: [
          {
            title: `Ban ${member.user.username}?`,
            color: 0xff0000,
          },
        ],
        ephemeral: true,
        components: [yesNo],
      });

      interaction.client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;

        if (!interaction.user.id == interaction.message.author.id) {
        } else {
          if (interaction.customId === "yesSucces") {
            await banMessage.delete();
            await member.ban();
            await member.send(
              `You have been banned from ${interaction.guild.name}. `
            );
            await interaction.channel.send({
              embeds: [
                {
                  title: `${member.user.username} has been banned!`,
                  color: 0xff0000,
                },
              ],
              ephemeral: false,
            });
          } else if (interaction.customId === "noDanger") {
            await banMessage.delete();
          }
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "An error occurred while trying to ban the member. Please make sure I have sufficient permissions to perform this action.",
        ephemeral: true,
      });
    }
  },
};
