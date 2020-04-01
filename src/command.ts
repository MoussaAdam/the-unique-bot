import { oneof, random } from "./utils";
import {
    getCompliment,
    getComplimentWithAlliteration,
    getOfficialCompliment
} from "knope";

import fetch from "node-fetch";
export default function command(commands: Array<string>, { channel, author }) {
    switch (commands[0]) {
        case 'compliment': case 'comp': case 'c':
            const c = oneof([
                getCompliment,
                getComplimentWithAlliteration,
                getOfficialCompliment
            ]);
            const length = random(20) == 10 ? random(12, 26) : random(1, 5);
            channel.send(c(commands[1] || author, length));
            break;
        case "joke":
            fetch("https://icanhazdadjoke.com/", { headers: { accept: "text/plain" } })
                .then(r => r.text())
                .then(r => channel.send(r));
            break;
        case "purge":
            if (author.hasPermission('MANAGE_MESSAGES')) {
                const n = parseFloat(commands[1]);
                channel.bulkDelete(n);
            }
            break;
        default:
            channel.send('I is Confused :confused:, i think i dont know this Command');
            break;
    }

}