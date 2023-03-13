import { Client } from "discord.js";
import dotenv from "dotenv";

const client = new Client();

dotenv.config();
const token = process.env.CLIENT;

client.on("message", (message) => {
  if (message.content == "cat") {
    message.reply("https://tenor.com/view/cat-twerk-gif-20194055");
  }
});

client.login(token);
