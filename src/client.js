const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

dotenv.config();

console.log(process.env.BOT_TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: false,
  leaveOnStop: false,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});

client.emotes = {
  play: "▶️",
  stop: "⏹️",
  queue: "📄",
  success: "☑️",
  repeat: "🔁",
  error: "❌",
};

module.exports = client;
