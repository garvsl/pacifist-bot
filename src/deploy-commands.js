const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv").config();

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

// rest
//   .delete(
//     Routes.applicationCommand(process.env.CLIENTID, "1086004751432433775")
//   )
//   .then(() => console.log("Successfully deleted application command"))
//   .catch(console.error);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("error:", error);
  }
})();
