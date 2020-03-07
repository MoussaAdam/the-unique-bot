import command from "./command";
import { Client, TextChannel, Collection } from "discord.js";
import * as templates from "./templates";

const Bot = new Client();
const { log } = console;

// Log in
Bot.login(process.env.SECRET);
Bot.once("ready", () => log("ok i have just logged in! :)"));

const cache: Collection<string, Collection<string, TextChannel>> = new Collection();

// Welcoming
Bot.on("guildMemberAdd", member => {
  const { guild } = member;
  const { id: GID } = guild;

  // Check/SetUp Cache
  if (!cache.has(GID)) cache.set(GID, new Collection());

  // find a welcome channel
  if (!cache.get(GID).has('welcome')) {
    const rxp = /(welcome|start)[ \-]*(page|channel)?/i;
    const channel = guild.channels.find(channel => rxp.test(channel.name))
    cache.get(GID).set('welcome', new TextChannel(guild, channel));
  }

  // find the rules channel
  if (!cache.get(GID).has('rules')) {
    const channel = guild.channels.find(channel => channel.name.includes("rule"));
    cache.get(GID).set('rules', new TextChannel(guild, channel));
  }

  // check the existance of the channels
  const welcome = cache.get(GID).get('welcome');
  const rules = cache.get(GID).get('welcome');
  if (!welcome) {
    log("couldn't find a welcome channel, imma go outta here ~ bye");
    return;
  }

  // send the welcome message
  welcome.send(templates.welcome(guild, rules, member));
});

// Handle commands
Bot.on("message", message => {
  const { channel } = message;

  // i dont like Dm :/
  if (channel.type == "dm") {
    message.author.send("sorry i can't handle Direct Messages :sweat_smile:");
    return;
  }

  let { content } = message;
  content = content.trim();

  // pinging
  if (content.toLowerCase() === "ping") {
    message.channel.send(content.replace('i','o').replace('I', 'O'));
  }

  // if it's a command lets handle it
  if (content[0] == ";") {
    content = content.slice(1).trim().toLowerCase();
    command(content.split(/\s+/), message);
  }
});

// Confessions
Bot.on("message", message => {
  const { author } = message;
  if (author.bot) return;
  const { guild, channel } = message;
  const { channels } = guild;
  const gConfess = channels.find(({ name }) => name.includes("confess"));
  if (!gConfess) return;
  if (channel.id !== gConfess.id) return;
  message.delete();
  const cConfess = new TextChannel(guild, gConfess);
  cConfess.send(templates.confession(message.content));
});
