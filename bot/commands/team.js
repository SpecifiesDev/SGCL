const Discord = require('discord.js');
var teamcommands = '**`newteam`**, **`leaveteam`**, **`teaminfo`**,  **`teamlist`**'
module.exports = {
    name: 'team',
    description: 'Team Management',
    execute(message, args){
        if(args[1] === 'help'){
            const teamhelp = new Discord.MessageEmbed()
            .setAuthor('Survival Games Competitive League Bot')
            .setDescription('Use - as the Prefix')
            .setColor(0xCE59EE)
            .addField('*All the commands for team management!*', teamcommands)
            .setThumbnail('https://i.imgur.com/4n7UQzY.png')
            .setFooter('Official SGCL Bot')
            message.channel.send(teamhelp);
        }else{
            message.channel.send('Do **`-team help`** for more commands.')
            }
    }
}