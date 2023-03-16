const { SlashCommandBuilder } = require("discord.js");

async function fetchCat() {
  const fetch = await import("node-fetch");
  const result = await fetch.default(
    "https://api.giphy.com/v1/gifs/random?api_key=tixj1tmfOp06X9Ty4qN8eKxrGiCkSW7r&tag=cat&rating=r"
  );
  const resultJson = await result.json();
  const url = resultJson.data.url;
  return url;
}

module.exports = {
  data: new SlashCommandBuilder().setName("cat").setDescription("Sends a cat"),
  async execute(interaction) {
    interaction.reply(await fetchCat());
  },
};
