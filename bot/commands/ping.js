const embeds = require('../embeds');


const execute = async (message) => {
    const deleteAfter = await message.channel.send("Cauclating...");
    await message.channel.send(embeds.embed("Pong.", `Response latency is ${deleteAfter.createdTimestamp - message.createdTimestamp}ms.`));
    (await deleteAfter).delete();
    return;
}

module.exports = { execute: execute };