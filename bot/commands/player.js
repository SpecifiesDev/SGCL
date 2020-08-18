const embeds = require('../embeds');
const axios = require('axios');
const discord = require('discord.js');

const execute = async (message, args, prefix) => {

    if(args[1] == null) await message.channel.send(embeds.embed("Invalid Paramaters", `**Usage**:\n${prefix}player {name} (season)`));
    else if(args[2] == null) {

        let player = await axios.get(`http://localhost/api/v1/players/player/${args[1]}`);

        
        let response = player.data;

        if(response.success) {


            let seasonString = "";

            let seasons = response.seasons;
            for(seas in seasons) {
                let season = seasons[seas];

                if(seas == seasons.length - 1) seasonString += season;
                else seasonString += `${season}, `;

            }

            let kdr = response.kills / response.deaths;

            let xpResponse = await axios.get(`http://localhost/api/v1/players/player/${args[1]}/xp`);

            if(!xpResponse.data.success) return await message.channel.send(embeds.embed("Error", "There was an error with retrieving the player experience."));

            let embed = new discord.MessageEmbed()
            .setColor("#7590bd")
            .setTitle(response.ign)
            .setDescription(`Overall Stats`)
            .setTimestamp()
            .setFooter("© ✨ Austin#9949")
            .setThumbnail(`https://crafatar.com/avatars/${response.id}`)
            .addField('Seasons Played', seasonString, false)
            .addFields({name: 'Kills', value: response.kills, inline: true}, {name: "Deaths", value: response.deaths, inline: true}, {name: "K/D", value: kdr.toFixed(2), inline: true})
            .addFields({name: 'Points', value: response.points, inline: true}, {name: 'Experience', value: xpResponse.data.xp, inline: true}, {name: '\u200b', value: '\u200b', inline: true});

            await message.channel.send(embed);

        } else await message.channel.send(embeds.embed("Player Not Found", `No statistics for the player "${args[1]}" could be found.`));


    } else {

        let playerResponse = await axios.get(`http://localhost/api/v1/players/player/${args[1]}`);

        if(!playerResponse.data.success) return await message.channel.send(embeds.embed("Player Not Found", `No statistics for the player "${args[1]}" could be found.`));
        
        let seasons = await axios.get(`http://localhost/api/v1/seasons/season/${args[2]}`);

        if(!seasons.data.success) return await message.channel.send(embeds.embed("Season Not Found", `No statistics for the season "${args[2]}" could be found.`));

        if(!playerResponse.data.seasons.includes(args[2])) return await message.channel.send(embeds.embed("Didn't Play In Season", `${playerResponse.data.ign} didn't play during Season ${args[2]}.`));

        let tourns = seasons.data.tournaments;

        let tournData = [];

        for(tournIndex in tourns) {
            let tourn = tourns[tournIndex];

            let tournament = await axios.get(`http://localhost/api/v1/tournaments/tournament/${tourn}`);

            if(!(tournament == null) && !(seasons.data.success == false)) tournData.push(tournament.data);

        }

        
        // mk I JUST realized that this was possible and I've been writing javascript for two years... I'm not gonna go back and change the other loops but ffs
        let kills = 0;
        let deaths = 0;
        let points = 0;
        let gamesPlayed = 0;
        for(tourn of tournData) {
            for(round of tourn.rounds) {
                
                // Follow the tree we specify for duo games
                if(tourn.type === "duos") {

                    for(game of round.games) {
                        gamesPlayed++;
                        for(team of game.teams) {
                            for(player of team.players) {
                                if(player.ign == playerResponse.data.ign) {
                                    kills += player.kills;
                                    deaths += player.deaths;
                                    points += player.points;
                                }
                            }
                        }
                    }

                } else if(tourn.type == "solos") {

                    // Follow the tree we specify for solo games. As we don't have a solo tournament I have no way to thoroughly test this, so we may have to debug this later on
                    for(game of round.games) {
                        gamesPlayed++;
                        for(player of game.players) {
                            if(player.ign == playerResponse.data.ign) {
                                kills += player.kills;
                                deaths += player.deaths;
                                points += player.points;
                            }
                        }
                    }

                }
                
            }
        }

        // calculate kdr
        let kdr = kills / deaths;
        // create custom embed
        let embed = new discord.MessageEmbed()
        .setColor("#7590bd")
        .setTitle(playerResponse.data.ign)
        .setDescription(`Performance During Season ${args[2]}`)
        .setTimestamp()
        .setFooter("© Austin#9949  ✨")
        .setThumbnail(`https://crafatar.com/avatars/${playerResponse.data.id}`)
        .addField('Games Played', gamesPlayed, false)
        .addFields({name: 'Kills', value: kills, inline: true}, {name: "Deaths", value: deaths, inline: true}, {name: "K/D", value: kdr.toFixed(2), inline: true})
        .addField('Points', points, false);

        await message.channel.send(embed);

    }



}

module.exports = { execute: execute };