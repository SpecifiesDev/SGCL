const embeds = require('../embeds');
const axios = require('axios');
const discord = require('discord.js');


const execute = async (message, args, prefix) => {

    if(args[1] == null) await message.channel.send(embeds.embed("Invalid Arguments", `**Usage**:\n${prefix}tournament {name} (round) (game)`));

    else if(args[1] && args[2] == null) { 

        let id = hashCode(args[1]);

        let tournResponse = await axios.get(`http://localhost/api/v1/tournaments/tournament/${id}`);

        let tourn = tournResponse.data;
        if(!tourn.success) return await message.channel.send(embeds.embed("Tournament Not Found", `No data on the tournament ${id} could be pulled.`));

        let gamesPlayed = 0;
        let rounds = [];
        let players = [];
        let top3 = new Map();

        // Again, separate data trees
        if(tourn.type == "solos") {

            for(round of tourn.rounds) {

                if(!rounds.includes(round.name)) rounds.push(round.name);
                if(round.name == "Finals") {
                    for(placement of round.placements) {
                        let validPlacements = ["1", "2", "3"];
                        if(validPlacements.includes(placement.placement)) top3.set(placement.placement, placement.player);
                        
                    }
                }
                for(game of round.games) {
                    gamesPlayed++;
                    for(player of game.players) {
                        if(!players.includes(player.ign)) players.push(player.ign);
                    }
                }
            }

        } else if(tourn.type == "duos") {

            for(round of tourn.rounds) {

                if(!rounds.includes(round.name)) rounds.push(round.name);

                if(round.name == "Finals") {
                    for(placement of round.placements) {
                        let validPlacements = ["1", "2", "3"];
                        if(validPlacements.includes(placement.placement)) top3.set(placement.placement, placement.team);
                        
                    }
                }

                for(game of round.games) {
                    gamesPlayed++;
                    for(team of game.teams) {
                        for(player of team.players) {
                            if(!players.includes(player.ign)) players.push(player.ign);
                        }
                    }
                }

            }

        }

        let roundString = "";

        if(rounds.length > 1) roundString = rounds.join(', ').slice(0, -1);
        else roundString = rounds.join(', ');

        console.log(message.author.avatarURL());
        let embed = new discord.MessageEmbed()
        .setColor("#7590bd")
        .setTitle(args[1])
        .setDescription(`Tournament Overview`)
        .setTimestamp()
        .setFooter("© ✨ Austin#9949")
        .setThumbnail(message.author.avatarURL())
        .addField('Rounds Played', roundString, false)
        .addFields({name: 'Games Played', value: gamesPlayed, inline: true}, {name: "Unique Players", value: players.length, inline: true})
        
        if(tourn.type == "duos") {

            if(top3 > 0) embed.addField("Top Three Teams", `1.) ${top3.get(1)}\n2.) ${top3.get(2)}\n3.)${top3.get(3)}`);
            else embed.addField("Top Three Teams", "Sorry, this tournament doesn't contain a final round yet.", false);

        } else if(tourn.type == "solos") {
            if(top3 > 0) embed.addField("Top Three Players", `1.) ${top3.get(1)}\n2.) ${top3.get(2)}\n3.)${top3.get(3)}`);
            else embed.addField("Top Three Players", "Sorry, this tournament doesn't contain a final round yet.", false);
        }

        await message.channel.send(embed);

    } else if(args[2] && args[3] == null) {

    } else {

    }

}

const hashCode = s => {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

module.exports = { execute: execute };