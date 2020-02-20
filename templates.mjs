import rcolor from "randomcolor";
export function welcome(guild, rules, user) {
    const admins = guild.roles.find(role => /admin(istrator)?s?|mod(erator)?s?/i.test(role.name)).members;
    return {
        embed: {
            color: 0x97ad5b,
            author: {
                name: `Welcome to '${guild}'`,
                icon_url: guild.iconURL,
            },
            title: `Hi ${user.username} !`,
            thumbnail: user.displayAvatarURL,
            description: [
                'We are all pleased to have **you** here :heart:\n',
                rules ? `Please head over to ${rules}` : '',
            ].filter(m => m).join('\n'),
            fields: [
                {
                    name: 'Notice',
                    value: '**\\*** you can see the rest of the server by agreeing to the rules, just tap :white_check_mark:'
                }, {
                    name: 'Date',
                    value: new Date().toLocaleString('en-GB')
                },
            ],
            footer: `Admin ~ ${admins.array().join(' & ')}`
        }
    };
}

export function confession(message) {
    return {
        embed: {
            color: parseInt(rcolor().slice(1), 16),
            author: {
                name: 'Anonymous',
                icon_url: 'https://img.icons8.com/cotton/2x/gender-neutral-user--v1.png'
            },
            description: message
        }
        };
    };