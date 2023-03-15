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
    .setName("kick")
    .setDescription("Kicks a member from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
        content: "You cannot kick yourself!",
        ephemeral: true,
      });
    }

    const authorHighestRole = interaction.member.roles.highest;
    const targetHighestRole = member.roles.highest;

    if (targetHighestRole.position >= authorHighestRole.position) {
      return await interaction.reply({
        content: "You do not have sufficient permissions to kick this member!",
        ephemeral: true,
      });
    }

    try {
      const kickMessage = await interaction.reply({
        embeds: [
          {
            title: `Kick ${member.user.username}?`,
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
            await kickMessage.delete();
            await member.kick();
            await member.send(
              `You have been kicked from ${interaction.guild.name}. `
            );
            await interaction.channel.send({
              embeds: [
                {
                  title: `${member.user.username} has been kicked!`,
                  color: 0xff0000,
                },
              ],
              ephemeral: false,
            });
          } else if (interaction.customId === "noDanger") {
            await kickMessage.delete();
          }
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "An error occurred while trying to kick the member. Please make sure I have sufficient permissions to perform this action.",
        ephemeral: true,
      });
    }
  },
};
