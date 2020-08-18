const fs = require('fs');
const discord = require('discord.js');
const axios = require('axios');

// grab configuration for the bot
const config = JSON.parse(fs.readFileSync("./manifest.json"));

// configuration values
const prefix = config.prefix;
const token = config.token;

// set up the bot
const client = new discord.Client();

// iterate over commands, add them to a map for later manipulation
let commands = new Map();
let commandDir = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(let file of commandDir) {
    let command = require(`./commands/${file}`);

    let identifier = file.split('.js')[0];
    
    commands.set(identifier, command);

}

client.on("ready", () => {
    console.log("Bot ready to serve.");
    client.user.setActivity(`${prefix}help`);
});

client.on("message", async(message) => {

    let content = message.content;
    let guildId = message.guild.id;

    if(message.author.bot) return;

    if(content.indexOf(prefix) == 0) {

        const args = content.slice(prefix).trim().split(/ +/g);

        const command = args[0].toLowerCase();

        if(command === `${prefix}ping`) commands.get('ping').execute(message);

        if(command === `${prefix}p` || command === `${prefix}player`) commands.get('player').execute(message, args, prefix);

        if(command === `${prefix}t` || command === `${prefix}tournament`) commands.get('tournament').execute(message, args, prefix);

    }

});

client.login(token);