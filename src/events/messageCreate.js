const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot) {
      return;
    }

    if (message.content.includes("cat")) {
      message.reply("https://tenor.com/view/cat-twerk-gif-20194055");
      message.react("😼");
    }

    if (message.content.includes("<@323264863487000578>")) {
      message.reply(
        "https://tenor.com/view/drake-drake-computer-kill-your-self-gif-25432024"
      );
    }
  },
};
