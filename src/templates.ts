import palette from "./palette";
import { oneof } from "./utils";
import {
  GuildMember,
  TextChannel,
  Message,
  RichEmbedOptions,
} from "discord.js";

export function rules(rules: TextChannel): RichEmbedOptions {
  return {
    color: 0xf94a58,
    title: `IMPORTANT NOTICE !!`,
    description: `THIS IS **JUST A WELCOME PAGE**! PLEASE HEAD OVER TO ${rules} AND **AGREE** BY **SIMPLY** **TAP**ING **THIS ICON** :white_check_mark: AT THE END OF THE AGREEMENT, ITS **THE ONLY WAY TO ACCESS** THE REST OF  SERVER`,
    thumbnail: { url: "https://iconsplace.com/wp-content/uploads/_icons/f94a58/256/png/high-importance-icon-14-256.png", },
  };
}

export function welcome({ user, guild }: GuildMember): RichEmbedOptions {
  const { owner } = guild;
  //const admins = guild.roles.find(role => /admin(istrator)?s?|mod(erator)?s?/i.test(role.name)).members;
  return {
    color: 0x97ad5b,
    author: {
      name: `Welcome to '${guild}'`,
      icon_url: guild.iconURL,
    },
    title: `Hi ${user.username} !`,
    thumbnail: { url: user.displayAvatarURL },
    description: ["We are all pleased to have **you** here :heart:"].join("\n"),
    fields: [
      {
        name: "Date",
        value: new Date().toLocaleString("en-GB"),
      },
    ],
    footer: { text: `Owner ~ ${owner.nickname||owner.displayName}` },
  };
}

export function confession({ content }: Message): RichEmbedOptions {
  return {
    color: oneof(palette),
    author: {
      name: "Anonymous",
      icon_url: "https://img.icons8.com/cotton/2x/gender-neutral-user--v1.png",
    },
    description: content,
  };
}
