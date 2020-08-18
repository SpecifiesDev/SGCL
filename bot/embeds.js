const discord = require("discord.js");

const newEmbed = (title, desc) => {
    return new discord.MessageEmbed()
    .setColor("#7590bd")
    .setTitle(title)
    .setDescription(desc)
    .setTimestamp()
    .setFooter("© ✨ Austin#9949");
}

module.exports = { embed: newEmbed }