import command from "./command";
import { Client, TextChannel, Collection } from "discord.js";
import * as templates from "./templates";

const Bot = new Client();
const { log } = console;

// Log in
Bot.login(process.env.SECRET);
Bot.once("ready", () => log("ok i have just logged in! :)"));

const cache: Collection<string, Collection<string, TextChannel>> = new Collection();

// Welcoming New Members
Bot.on("guildMemberAdd", member => {
  const { guild } = member;
  const { id: GID } = guild;

  // Get/Set the Cache for the server
  if (!cache.has(GID)) cache.set(GID, new Collection());

  // Get/Set neeeded Channels Cache
  // look for a welcome channel
  if (!cache.get(GID).has('welcome')) {
    const rxp = /(welcome|start)[ \-]*(page|channel)?/i;
    const channel = guild.channels.find(channel => rxp.test(channel.name))
    cache.get(GID).set('welcome', new TextChannel(guild, channel));
  }

  // look for a rules channel
  if (!cache.get(GID).has('rules')) {
    const channel = guild.channels.find(channel => channel.name.includes("rule"));
    cache.get(GID).set('rules', new TextChannel(guild, channel));
  }

  // check the existance of the channels
  const welcome = cache.get(GID).get('welcome');
  const rules = cache.get(GID).get('rules');
  if (!welcome) {
    log("couldn't find a welcome channel, imma go outta here ~ bye");
    return;
  }

  // send the welcome message
  import('./templates');
  welcome.send(templates.welcome(guild, rules, member));
});

// Handle commands and messages
Bot.on("message", message => {
  //i dont answer bots :/
  const { author } = message;
  if (author.bot) return;

  // nor Direct Messages :/
  const { channel } = message;
  if (channel.type == "dm") {
    message.author.send("sorry i can't handle Direct Messages :sweat_smile:");
    return;
  }

  // ignore spaces
  let { content } = message;
  content = content.trim();

  // pinging
  if (content.toLowerCase() === "ping") {
    message.channel.send(content.replace('i','o').replace('I', 'O'));
  }

  // confession management
  // look for a confession channel
  const { guild } = message;
  const { id: GID } = guild;
  if (!cache.has(GID)) cache.set(GID, new Collection());
  if (!cache.get(GID).has('rules')) {
    const channel = guild.channels.find(({ name }) => name.includes("confess"));
    cache.get(GID).set('confess', new TextChannel(guild, channel));
  }

  // do we hve a confession channel, and is this message posted in it 
  const confess = cache.get(GID).get('confess');
  if (confess && channel.id == confess.id) {
    message.delete();
    confess.send(templates.confession(message.content));
  }

  // if it's a command lets handle it
  if (content[0] == ";") {
    content = content.slice(1).trim().toLowerCase();
    command(content.split(/\s+/), message);
  }
});