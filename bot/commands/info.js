const Discord = require('discord.js');
module.exports = {
    name: 'info',
    description: 'Information on Bot',
    execute(message, args){
        const info = new Discord.MessageEmbed()
            .setAuthor('Survival Games Competitive League Bot', 'https://i.imgur.com/4n7UQzY.png')
            .setDescription('Information on this Bot')
            .addField('Version', '0.0.1', true)
            .addField('Created by', '@Asnaf#2798')
            .setColor(0xCE59EE)
            .addField('Server', message.guild.name)
            .setFooter('Official SGCL Bot')
            .setThumbnail('https://i.imgur.com/4n7UQzY.png')
            message.channel.send(info);
    }
    
}