const Discord = require('discord.js');
var below = '*All the general commands on this bot!*'
var commands = '**`help`**,  **`info`**,  **`rank`**,  **`team`**,  **`stats`**,  **`leaderboard`**,  **`lb`**,  **`season`**'

module.exports = {
    name: 'help',
    description: 'Bot Commands',
    execute(message, args){
        const help = new Discord.MessageEmbed()
            .setAuthor('Survival Games Competitive League Bot')
            .setDescription('Use - as the Prefix')
            .addField(below, commands)
            .setFooter('Official SGCL Bot')
            .setColor(0xCE59EE)
            .setThumbnail('https://i.imgur.com/4n7UQzY.png')
            message.channel.send(help);
    }
}