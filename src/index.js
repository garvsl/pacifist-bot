const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

dotenv.config();
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");

const client = require("./client.js");

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

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\``;
client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${
        song.formattedDuration
      }\`\n${status(queue)}`
    )
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue`
    )
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on("error", (channel, e) => {
    if (channel)
      channel.send(
        `${client.emotes.error} | An error encountered: ${e
          .toString()
          .slice(0, 1974)}`
      );
    else console.error(e);
  })
  .on("empty", (channel) =>
    channel.send("Voice channel is empty! Leaving the channel...")
  )
  .on("searchNoResult", (message, query) =>
    message.channel.send(
      `${client.emotes.error} | No result found for \`${query}\`!`
    )
  )
  .on("finish", (queue) => queue.textChannel.send("Finished!"))

  .on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(
      `**Choose an option from below**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*Enter anything else or wait 30 seconds to cancel*`
    );
  })
  .on("searchCancel", (message) => message.channel.send("Searching canceled"))
  .on("searchInvalidAnswer", (message) =>
    message.channel.send("Invalid number of result.")
  )
  .on("searchNoResult", (message) => message.channel.send("No result found!"))
  .on("searchDone", () => {});

module.exports = client;

client.login(process.env.BOT_TOKEN);
