const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot) {
      return;
    }
  },
};
