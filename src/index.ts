import command from "./command";
import { Client } from "discord.js";
import * as templates from "./templates";
import cache from "./cache";

// Bot id 679986715229814794
// Owner id 540563047824228352
// Bot invite https://discordapp.com/oauth2/authorize/?permissions=401735275&scope=bot&client_id=679986715229814794
// Bot invite https://discordapp.com/oauth2/authorize/?client_id=679986715229814794&scope=bot&permissions=334626175

const Bot = new Client();
const { log } = console;

Bot.once("ready", () => {
  log(`ok i have just logged in!, i am ${Bot.user.tag} <${Bot.user.id}>`);
  setTimeout(() => {
    Bot.user.setActivity('Looking after "Sweet Home" and some other servers');
  }, 1000 * 30);
});

// Welcome New Members
Bot.on("guildMemberAdd", (member) => {
  const guild = cache(member.guild);
  guild.ifhas('welcome', (channel) => {
    channel.sendEmbed(templates.welcome(member));
    guild.get('rules', (rules) => {
      channel.sendEmbed(templates.rules(rules))
    });
  });
});

// Handle commands and messages
Bot.on("message", (message) => {
  const { author } = message;

  //   //i dont reply bots, including myself :/
  if (author.bot) return;

  // sorry no Direct Messages :/
  const { channel } = message;
  if (channel.type == "dm") {
    message.author.send("sorry i dont answer Direct Messages :sweat_smile:.. yet...");
    return;
  }

  // remove spaces
  let { content } = message;
  content = content.trim();

  // pinging
  if (content.toLowerCase() === "ping") {
    message.channel.send(content.replace("i", "o").replace("I", "O"));
  }

  // if it's a command lets handle it
  if (content[0] == ";") {
    content = content.slice(1).trim().toLowerCase();
    command(content.split(/\s+/), message);
    return;
  }

  // confession management
  // look for a confession channel
  cache(message.guild).ifhas('confess', channel => {
    if (message.channel.id !== channel.id) return;
    message.delete();
    channel.sendEmbed(templates.confession(message));
  });

});

// Log in
if (!("DISCORD_UNIQUE_TOKEN" in process.env)) {
  throw new Error("No Client Token Specified");
}
Bot.login(process.env.DISCORD_UNIQUE_TOKEN);