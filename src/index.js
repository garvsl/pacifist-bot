const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActivityType,
  Events,
  Collection,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const token = process.env.CLIENT;

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content == "cat") {
    message.reply("https://tenor.com/view/cat-twerk-gif-20194055");
    message.react("😼");
  }

  const offensiveWords = /n(?!i)[a-z]*g[b-z]*/i;
  if (offensiveWords.test(message.content)) {
    message.reply({ content: "...", ephemeral: true });
    message.delete();
  }

  if (message.content == "test") {
    message.reply({ content: "stfu", ephemeral: true });
  }
});

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

client.on("ready", (c) => {
  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    console.log(random);
    client.user.setActivity(status[random]);
  }, 90000);
});

client.login(token);

module.exports = { client, token };
