const { Events, ActivityType } = require("discord.js");

const status = [
  {
    name: "Meekz",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=hm-MOdLU21M",
  },
  {
    name: "Meekz",
    type: ActivityType.Listening,
    url: "https://www.youtube.com/watch?v=hm-MOdLU21M",
  },
  {
    name: "Meditation",
    type: ActivityType.Competing,
  },
];

module.exports = {
  name: Events.ClientReady,
  execute(client) {
    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      console.log(random);
      client.user.setActivity(status[random]);
    }, 90000);
  },
};
