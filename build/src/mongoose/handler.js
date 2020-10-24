const Player = require('./schemas/player');
const Season = require('./schemas/season');
const Tournament = require('./schemas/tournament');

const mongoose = require('mongoose');
const axios = require('axios');

const database = "SGCL"

const internal_error = {success: false, message: "Internal Server Error", code: 500};

mongoose.connect(`mongodb+srv://deploy:27plh6RqdQPmYlVF@mineplexstats-3clnx.mongodb.net/${database}?retryWrites=true&w=majority`, { useFindAndModify: true, useUnifiedTopology: true, useNewUrlParser: true}).catch((err) => {console.log(err)});


const createSeason = async(req, res) => {

    let number = req.body.number;

    if(!number) return res.json({success: false, message: "Missing parameters"});

    let count = await Season.countDocuments({number: number});
    if(count > 0) return res.json({success: false, message: "Season already exists."});

    let season = Season({number: number, tournaments: []});

    await season.save().then(() => {res.json({success: true, message: "Season created.", code: 200})}).catch(err => {res.json(internal_error)});

}

const createTournament = async(req, res) => {

    let season = req.body.season;
    let name = req.body.name;
    let type = req.body.type;
    let rounds = req.body.rounds;

    if(!season || !name || !type || !rounds) return res.json({success: false, message: "Missing parameters"});

    let seasonCount = await Season.countDocuments({number: season});

    if(!(seasonCount > 0)) return res.json({success: false, message: "Inputted season doesn't exist"});
    
    let tournCount = await Tournament.countDocuments({UUID: hashCode(name)});

    if(tournCount > 0) return res.json({success: false, message: "Tournament already exists"});

    if(!(type == "duos") && !(type == "solos")) return res.json({success: false, message: "Invalid type inserted."});

    
    Season.findOne({number: season}, async (err, resp) => {
        if(err) return res.json(internal_error);

        let array = resp.tournaments;
        array.push(hashCode(name));

        resp.tournaments = array;

        

        let tournament = Tournament({season: season, UUID: hashCode(name), rounds: {}, name: name, type: type});

        
        for(index in rounds) {

            let round = rounds[index];

            tournament.rounds.set(`${round.name}`, round); // We use the literal as a hacky way to force convert to a string because mongoose refuses to take a number
        
            if(type == "duos") {

                let games = round.games;

                // A lot of nested for loops to traverse the tree
                for(gameIndex in games) {
                    let game = games[gameIndex];

                    let teams = game.teams;

                    for(teamIndex in teams) {
                        let team = teams[teamIndex];
    
                        let players = team.players;
    
                        for(playerIndex in players) {
                            let player = players[playerIndex];
                            
                            // See if the player exists
                            let count = await Player.countDocuments({ign: player.ign});

                            // Utilize the mojang API to grab the player's UUID
                            let uuidRequest = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player.ign}`);

                            let uuid = uuidRequest.data.id;

                            // If the uuid is undefined, the player doesn't exist or match mc's name schema. Skip
                            if(!(uuid == null)) insertPlayer(player, count, uuid, name, season);

                            


                        }
    
                    }
                }



            } else if(type == "solos") {

                let games = round.games;

                for(gameIndex in games) {
                    let game = games[gameIndex];

                    let players = game.players;

                    for(playerIndex in players) {
                        let player = players[playerIndex];

                        // See if the player exists
                        let count = await Player.countDocuments({ign: player.ign});

                        // Utilize the mojang API to grab the player's UUID
                        let uuidRequest = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player.ign}`);
                        
                        let uuid = uuidRequest.data.id;

                        if(!(uuid == null)) insertPlayer(player, count, uuid, name, season);

                        

                    }

                }

            }

        }

        await tournament.save().then(async () => {await Season.updateOne(resp); res.json({success: true, message: "Tournament created", id: hashCode(name), code: 200});}).catch(err => {console.log(err); res.json({internal_error})});

        
    });
     
}

const createReport = async(req, res) => {

    let cid = req.body.cid;
    let message = req.body.message;

    Player.find({}, (err, players) => {
        
        players.map(player => {
            console.log(player);
        });
    });

}

const createPlayer = async (req, res) => {

    let ign = req.body.ign;

    // If we're missing the necessary parameters return invalid request
    if(!ign || !team) return res.json({success: false, message: "Invalid request", code: 400});

    // Search player documents for ign
    let playerCount = await Player.countDocuments({ign: ign});

    // If the player was found, it already exists so we don't want to create another
    if(playerCount > 0) return res.json({success: false, message: "Player already exists."});

    let player = Player({ign: ign, uuid: uuid, kills: 0, deaths: 0, points: 0, tourns: []});

    await player.save().then(() => { res.json({success: true, message: "Player created", code: 200}); }).catch(err => {res.json(internal_error);});



}



const query_season = (number) => {

    return new Promise(async (resolve, reject) => {
        let count = await Season.countDocuments({number: number});
        if(!(count > 0)) return reject("Season doesn't exist.");
        
        Season.find({number: number}, (err, season) => {
            if(err) return reject("Internal Server Error");

            resolve(season);
        });

    });

}

const query_player = (name) => {

    return new Promise(async (resolve, reject) => {
        let count = await Player.countDocuments({ign: name});
        if(!(count > 0)) return reject("Player doesn't exist");

        Player.find({ign: name}, (err, player) => {
            if(err) return reject("Internal Server Error");

            resolve(player);
        });
    });

}

const query_tournaments = (uuid) => {

    return new Promise(async (resolve, reject) => {
        let count = await Tournament.countDocuments({UUID: uuid});
        if(!(count) > 0) return reject("Tournament doesn't exist");

        Tournament.find({UUID: uuid}, (err, tournament) => {
            if(err) return reject("Internal Server Error");

            resolve(tournament);
        });
    });
}


const hashCode = s => {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

const insertPlayer = async (player, count, uuid, name, season) => {
    if(count > 0) {

                                    
        Player.find({uuid: uuid}, async (err, response) => {
            if(err) return console.log(err);

            // for some reason this isn't counted as a document??? fucking weird but whatever
            let resp = response[0];

            let totalKills = resp.kills + player.kills;
            let totalDeaths = resp.deaths + player.deaths;
            let totalPoints = resp.points + player.points;
            let tournArr = resp.tourns;
            let seasonArr = resp.seasons;

            if(totalPoints == null) totalPoints = 0;

            if(!(tournArr.includes(hashCode(name)))) tournArr.push(hashCode(name));
            if(!seasonArr.includes(season)) seasonArr.push(season);

            let doc = await Player.findOne({ign: player.ign});
            await doc.updateOne({kills: totalKills, deaths: totalDeaths, points: totalPoints, tourns: tournArr, seasons: seasonArr});

            console.log("Player stats updated.");

        });

    } else {
        console.log(`${player.ign} doesn't exist... creating`);
        let playerDocument = Player({ign: player.ign, uuid: uuid, kills: player.kills, deaths: player.deaths, points: player.points, tourns: [hashCode(name)], seasons: [season]});
        playerDocument.save().then(() => {console.log("Player created");}).catch(err => {console.log(err);});
    }
}

/**
 * Iterative function to calculate the Levenshtein Distance between two strings.
 * @param {String} a First comparison string.
 * @param {String} b Second comparison string 
 */
const getLevenshteinDistance = (a, b) => {

    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
  
    let matrix = [];

    /*
    * We create 2DArray and populate along each column, and then each row.
    * We do this so that when we fill in the rest of the matrix, the values for insertion, deletion, and substituion
    * are based upon each corresponding letter in the loop.
    */
    for(let i = 0; i <= b.length; i++) matrix[i] = [i];
    for(let i = 0; i <= a.length; i++) matrix[0][i] = i;
    
  
    // Fill in the rest of the matrix
    for(let i = 1; i <= b.length; i++){
      for(let j = 1; j <= a.length; j++){
        // If the two characters are the same, the LD is equal to the number at the position.
        if(b.charAt(i-1) == a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1]; 
        // If they're not the same, calculate the costs for insertion, deletion, and subsitution
        else matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1)); 
      }
    }
  
    // Return the very last value in the matrix, AKA the calculated distance between the two strings.
    return matrix[b.length][a.length];
}



module.exports = { 
    createPlayer: createPlayer, query_player: query_player,
    createTournament: createTournament, createSeason: createSeason,
    query_season: query_season, query_tournaments: query_tournaments,
    createReport: createReport
};