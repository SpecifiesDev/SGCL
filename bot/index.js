// npm i discord.js
const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzAwMTU3NDE1MTg5OTA1NDQ5.Xpe2kg.97439s8eYnUrQPSdFuLR_6HE5NU';

const PREFIX = "-";

//Command Directory

const fs = require('fs');
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`)

    bot.commands.set(command.name, command);
}

//Commands
//I used a switch for this, if statements can also work.
//Most of the commands aren't setup yet, on discord the command might read "Coming soon" to indicate that it is not completed.

bot.on('ready', () =>{
    console.log('This bot is online');
    bot.user.setActivity('on SG2-1 | Use -help');
})

bot.on('message', message=>{
        
    let args = message.content.substring(PREFIX.length).split(" ");

    if(message.content.substring(0, PREFIX.length) == '-')
    
    switch(args[0]) {
        case 'ping':
            bot.commands.get('ping').execute(message, args);
            break;
        case 'help':
            bot.commands.get('help').execute(message, args);
            break;
        case 'info':
            bot.commands.get('info').execute(message, args);
            break;
        case 'team':
            bot.commands.get('team').execute(message, args);
            break;
        case 'lb':
            bot.commands.get('lb').execute(message, args);
            break;
        case 'leaderboard':
            bot.commands.get('leaderboard').execute(message, args);
            break;
        case 'rank':
            bot.commands.get('rank').execute(message, args);
            break;
        case 'season':
            bot.commands.get('season').execute(message, args);
            break;
        case 'teaminfo':
            bot.commands.get('teaminfo').execute(message, args);
            break;
        case 'teamlist':
            bot.commands.get('teamlist').execute(message, args);
            break;
        case 'leaveteam':
            bot.commands.get('leaveteam').execute(message, args);
            break;
        case 'newteam':
            bot.commands.get('newteam').execute(message, args);
            break;
        case 'jointeam':
            bot.commands.get('jointeam').execute(message, args);
            break;
    }
})

bot.login(token);