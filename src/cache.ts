import {
  Collection,
  Guild,
  GuildMember,
  Message,
  GuildChannel,
  TextChannel,
} from "discord.js";

import {
  accessSync,
  appendFileSync,
  writeFileSync,
  readFileSync,
  constants,
} from "fs";

class CachedGuild {
  guild: Guild;
  owner: GuildMember;
  data: JSON;
  #text: Collection<string, TextChannel>;

  constructor(guild: Guild, data: JSON) {
    this.guild = guild;
    this.owner = guild.owner;
    this.data = data;
    this.#text = new Collection();
  }

  get(name: string, cb: (channel: TextChannel) => any): void {
    if (this.#text.has(name)) {
      cb(this.#text.get(name));
    } else if (name in this.data) {
      const id = this.data[name];
      if (this.set(name, this.guild.channels.get(id))) {
        this.get(name, cb);
      }
    } else {
      cb(null);
    }
  }
  ifhas(name: string, cb: (channel: TextChannel) => any) {
    this.get(name, channel => { if (channel) cb(channel) })
  }
  set(name: string, channel: GuildChannel): boolean {
    if (this.guild.channels.has(channel.id) && channel.type == "text") {
      this.#text.set(name, channel as TextChannel);
      if (!(name in this.data) || this.data[name] !== channel.id) {
        this.data[name] = channel.id;
        (channel as TextChannel).send(
          `[Cache]: ${name} channel  is set to <${channel}>`
        );
      }
      return true;
    }
    return false;
  }

  autoFill(msg?: Message): void {
    // welcome channel
    const rxp = /(welcome|start|init)[ \-]*(page|channel)?/i;
    const welcome = this.guild.channels.find(
      (channel) => channel.type == "text" && rxp.test(channel.name)
    );
    if (!welcome) {
      if (msg) msg.channel.send("couldn't find any welcome channel");
    } else this.set("welcome", welcome);
    // rules channel
    const rules = this.guild.channels.find(
      (channel) => channel.type == "text" && channel.name.includes("rule")
    );
    if (!rules) {
      if (msg) msg.channel.send("couldn't find any rules channel");
    } else this.set("rules", rules);
    // confession channel
    const confession = this.guild.channels.find(
      (channel) => channel.type == "text" && channel.name.includes("confession")
    );
    if (!confession) {
      if (msg) msg.channel.send("couldn't find any confessions channel");
    } else this.set("confess", confession);
  }
}

class Data {
  #file: string;
  #json: JSON;
  constructor(file: string) {
    this.#file = file;
    // create the file if it doesnt exist
    try {
      accessSync(this.#file, constants.F_OK);
    } catch {
      try {
        appendFileSync(this.#file, "{}", { encoding: "utf8" });
      } catch (e) {
        console.error("unable to create a data file");
        throw e;
      }
    }
    // read the file
    try {
      accessSync(this.#file, constants.R_OK | constants.W_OK);
      const fileData = JSON.parse(
        readFileSync(this.#file, { encoding: "utf8" })
      );
      const that = this;
      this.#json = new Proxy(fileData, {
        set(target, key, value, r) {
          if (that.#json !== r) return false;
          target[key] = value;
          that.sync();
          return true;
        },
      });
    } catch (e) {
      console.error("data can't be opened accessed for rw");
      throw e;
    }
  }

  get json() {
    return this.#json;
  }

  sync() {
    writeFileSync(this.#file, JSON.stringify(this.#json), { encoding: "utf8" });
  }
}

const cache: Collection<string, CachedGuild> = new Collection();
const data = new Data(`${__dirname}/data.json`);

export default function guild(guild: Guild): CachedGuild {
  const { id } = guild;
  const { json } = data;
  if (!cache.has(id)) {
    if (!(id in json)) {
      json[id] = {};
    }
    cache.set(
      id,
      new CachedGuild(
        guild,
        new Proxy(json[id], {
          set(target, key, value, r) {
            target[key] = value;
            data.sync();
            return true;
          },
        })
      )
    );
  }
  return cache.get(id);
}
