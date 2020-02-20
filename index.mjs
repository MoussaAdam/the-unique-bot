import { log } from "console";

import Discord from "discord.js";
import knope from "knope";
import * as temp from "./templates.mjs";

const { Client, TextChannel } = Discord;
const Bot = new Client();
const {
   getCompliment: comp,
   getComplimentWithAlliteration: compall,
   getOfficialCompliment: compoff
} = knope;


log("I have just came to life yayyy!!..");
log("I will try to login to my account now");

// Log in
Bot.login(process.env.SECRET);
Bot.once("ready", () => {
   log("ok i have just logged in! :)");

   log("oh yeah! i am a bot!.. i mean.. beeb boop!");
});

// Welcoming
Bot.on("guildMemberAdd", member => {
   const { guild, user } = member;
   const { channels } = guild;
   log(`we have a newember yay!! '${guild.name}' is adeed`);
   log(`we gotta welcome him`);
   const reWelcome = /(welcome|start)[ \-]*(page|channel)?/i;
   const gWelcome = channels.find(({ name }) => reWelcome.test(name));
   const gRules = channels.find(({ name }) => name.includes('rule'));
   if (!gWelcome) {
      log('couldn\'t find a welcome channel, imma go outta here ~~~ bye');
      return;
   }
   const cWelcome = new TextChannel(guild, gWelcome);
   log(`i have just found a welcome channel '${cWelcome.name}'`);
   cWelcome.send(temp.welcome(guild, gRules, user));
   log(`ok done welcomed him`);
});

Bot.on("message", message => {
   const { channel } = message;
   let { content } = message;
   content = content.trim();
   log(`got a message "${content}"`);
   if (channel.type !== "dm" && content[0] == ";") {
      content = content.trim().slice(1);
      log(`removed unnecessary part now we have "${content}"`);
   }
   else {
      log('they are not taking to me, i wont reply');
      return;
   }
   const { author, guild } = message;

   content = content.trim().toLowerCase();
   log(`the command is '${content}'`);
   if (["welcome", "w"].includes(content)) channel.send(temp.welcome(guild, channel, author));
   if (content == "dm") author.send("hiii :heart:");
   if (["comp", "c"].includes(content)) {
      const c = oneof([comp, compall, compoff]);
      channel.send(c(author, oneof(2, 5)));
   }

});

// Confession
Bot.on("message", message => {
   const { author } = message;
   if (author.bot) return;
   const { guild, channel } = message;
   const { channels } = guild;
   const gConfess = channels.find(({ name }) => name.includes('confess'));
   if (!gConfess) return;
   if (channel.id !== gConfess.id) return;
   message.delete();
   const cConfess = new TextChannel(guild, gConfess);
   cConfess.send(temp.confession(message.content));
});

// Ping - Pong 
Bot.on("message", message => {
   const { content } = message;
   if (content.toLocaleLowerCase() === 'ping')
      message.channel.send(content.replace('i', 'o').replace('I', 'O'));
});

function oneof(array, b) {
   const { length } = array;
   const { random, floor } = Math;
   return b
      ? floor(random() * (b - array)) + array
      : array[floor(random() * length)];
}
