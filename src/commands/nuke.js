const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("WARNING! THIS COMMAND WILL NUKE THE SERVER ☢️ !!!")
    .setDMPermission(false),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;
    const embed = new EmbedBuilder();
    if (member.id == "323264863487000578") {
      try {
        // await interaction.channel.send("@everyone");
        let sentMessage;
        setTimeout(async () => {
          sentMessage = await interaction.channel.send(
            " https://tenor.com/view/invincible-omni-man-animals-i-will-burn-this-planet-down-gif-21709941"
          );
        }, 500);
        setTimeout(async () => {
          sentMessage.delete();

          await interaction.channel.send(
            " https://tenor.com/view/i-dont-have-a-choice-nolan-grayson-omni-man-invincible-i-have-no-choice-gif-21376165"
          );
        }, 8500);
        // setTimeout(() => {
        // let fetchedUsers = await guild.members.fetch();
        // fetchedUsers.forEach((member) => {
        //   setInterval(() => {
        //     member.ban({
        //       reason: "NUCLEAR BOMB UNLEASHED",
        //     });
        // await member.send(`You have been banned from ${interaction.guild.name}. Reason: Peace has been made (NUCLEAR BOMB UNLEASHED) `);
        //   }, 1000);
        // });
        // let fetchedChannel = await guild.channels.fetch();
        // fetchedChannel.forEach((channel) => {
        //   setInterval(() => {
        //     channel.delete();
        //   }, 1000);
        // });
        // }, 9000);
      } catch (e) {
        console.log(e);
      }
    } else {
      interaction.reply(
        "https://tenor.com/view/smile-monkey-orangutan-smiliong-orangutan-ape-gif-21939747"
      );
    }
  },
};
