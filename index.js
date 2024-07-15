import { Client, GatewayIntentBits, Message } from "discord.js";
import dotenv from "dotenv";

dotenv.config({
    path: '.env'
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate",(message)=>{

    if(message.author.bot) return
    if(message.content.startsWith("rate")) return
    if(message.content.startsWith("help")) return

    message.reply({
        content:"Hi from Saugat Bot"
    })
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("rate")) {
    const currencyCode = message.content.split(" ")[1];
    if (!currencyCode) {
      return message.reply("Please provide a currency code.");
    }

    message.reply("Fetching the rate...");

    try {
      const response = await fetch(
        "https://www.nrb.org.np/api/forex/v1/app-rate"
      );
      const data = await response.json();

      const currencyData = data.find(
        (item) => item.iso3 === currencyCode.toUpperCase()
      );

      if (!currencyData) {
        return message.reply(
          `No data found for currency code: ${currencyCode}`
        );
      }

      const replyMessage = `
        **Currency:** ${currencyData.name}
        **ISO Code:** ${currencyData.iso3}
        **Unit:** ${currencyData.unit}
        **Buy Rate:** ${currencyData.buy}
        **Sell Rate:** ${currencyData.sell}
        **Date:** ${currencyData.date}
        **Modified On:** ${currencyData.modified_on}
      `;

      message.reply(replyMessage);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.reply(
        "There was an error fetching the rate. Please try again later."
      );
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("help")) {
    try {
      const response = await fetch(
        "https://www.nrb.org.np/api/forex/v1/app-rate"
      );
      const data = await response.json();

      let replyMessage = "";

      for (let i = 0; i < data.length; i++) {
        const currencyData = data[i];
        replyMessage += `**Currency:** ${currencyData.name}
**ISO Code:** ${currencyData.iso3}
  ---

  `;

      }

      replyMessage = replyMessage.slice(0, -3);

      message.reply(replyMessage);
      message.reply("The Syntax for the one is Rate ISOCODE Example: rate USD")
    } catch (error) {
      console.error("Error fetching data:", error);
      message.reply(
        "There was an error fetching the rate. Please try again later."
      );
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});





client.login(process.env.TOKEN);
