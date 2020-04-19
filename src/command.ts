import { oneof, random } from "./utils";
import cache from "./cache";
import {
    getCompliment,
    getComplimentWithAlliteration,
    getOfficialCompliment
} from "knope";

import fetch from "node-fetch";
import { Message } from "discord.js";

export default function command(args: Array<string>, msg:Message) {
    const { channel, member, guild } = msg;
    switch (args[0]) {
        case 'compliment': case 'comp': case 'c':
            const c = oneof([
                getCompliment,
                getComplimentWithAlliteration,
                getOfficialCompliment
            ]);
            const length = random(20) == 10 ? random(12, 26) : random(1, 5);
            channel.send(c(args[1] || member, length));
            break;
        case "joke":
            fetch("https://icanhazdadjoke.com/", { headers: { accept: "text/plain" } })
                .then(r => r.text())
                .then(r => channel.send(r));
            break;
        case 'auto':
            cache(guild).autoFill(msg);
            break;
        case "purge":
            console.log(member.hasPermission('MANAGE_MESSAGES'))
            if (member.hasPermission('MANAGE_MESSAGES')) {
                const n = parseFloat(args[1]);
                channel.bulkDelete(n);
            }
            break;
        default:
            channel.send('I is Confused :confused:, i think i dont know this Command');
            break;
    }

}