const Player = require('./schemas/player');
const Team = require('./schemas/team');
const Game = require('./schemas/game');
const Season = require('./schemas/season');
const Tournament = require('./schemas/tournament');
const Round = require('./schemas/round');

let mongoose = require('mongoose');

const database = "SGCL"

const internal_error = {success: false, message: "Internal Server Error", code: 500};

mongoose.connect(`mongodb+srv://deploy:27plh6RqdQPmYlVF@mineplexstats-3clnx.mongodb.net/${database}?retryWrites=true&w=majority`, { useFindAndModify: true, useUnifiedTopology: true, useNewUrlParser: true}).catch((err) => {console.log(err)});

const createGame = async(req, res) => {

    let teams = req.body.teams;
    let name = req.body.name;
    let round = req.body.round;
    
    if(!teams || !name || !round) return res.json({success: false, message: "Missing parameters"});

    let gameCount = await Game.countDocuments({UUID: hashCode(name)});
    if(gameCount > 0) return res.json({success: false, message: "Game already exists"});

    let roundCount = await Round.countDocuments({UUID: round});
    if(!(roundCount) > 0) return res.json({success: false, message: "Round doesn't exist."});

    
}

const createRound = async(req, res) => {

    let type = req.body.type;
    let name = req.body.name;
    let tournament = req.body.tournament;

    if(!type || !name) return res.json({success: false, message: "Missing parameters"});

    let count = await Round.countDocuments({UUID: hashCode(name)});
    if(count > 0) return res.json({success: false, message: "Round already exists."});

    let tournCount = await Tournament.countDocuments({UUID: tournament});
    if(!(tournCount > 0)) return res.json({success: false, message: "Tournament doesn't exist."});

    let round = Round({games: [], type: type, UUID: hashCode(name)});

    Tournament.findOne({UUID: tournament}, async (err, resp) => {
        if(err) return res.json(internal_error);

        let arr = resp.rounds;

        arr.push(hashCode(name));

        resp.rounds = arr;

        await Tournament.updateOne(resp);

        await round.save().then(() => {res.json({success: false, message: "Round created.", id: hashCode(name), code: 200})}).catch(err => {res.json(internal_error)});
    });
    
    

}

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
    
    if(!season || !name) return res.json({success: false, message: "Missing parameters"});

    let seasonCount = await Season.countDocuments({number: season});

    if(!(seasonCount > 0)) return res.json({success: false, message: "Inputted season doesn't exist"});
    
    let tournCount = await Tournament.countDocuments({name: name});

    if(tournCount > 0) return res.json({success: false, message: "Tournament already exists"});

    Season.findOne({number: season}, async (err, resp) => {
        if(err) return res.json(internal_error);

        let array = resp.tournaments;
        array.push(hashCode(name));

        resp.tournaments = array;

        await Season.updateOne(resp);

        let tournament = Tournament({season: season, UUID: hashCode(name), rounds: [], name: name});

        await tournament.save().then(() => {res.json({success: true, message: "Tournament created", id: hashCode(name), code: 200});}).catch(err => {res.json({internal_error})});

        
    });
}

const createPlayer = async (req, res) => {

    let ign = req.body.ign;
    let team = req.body.team;

    // If we're missing the necessary parameters return invalid request
    if(!ign || !team) return res.json({success: false, message: "Invalid request", code: 400});

    // Search player documents for ign
    let playerCount = await Player.countDocuments({ign: ign});

    // If the player was found, it already exists so we don't want to create another
    if(playerCount > 0) return res.json({success: false, message: "Player already exists."});

    // Search team docs for name
    let teamCount = await Team.countDocuments({name: team});

    // If inserted team doesn't exist, throw an error
    if(!(teamCount > 0)) return res.json({success: false, message: "Team doesn't exist."});


    let player = Player({ign: ign, team: team, games: []});

    // We have to use a callback here, because if not we get a big bundled object that we don't really need
    Team.findOne({name: team}, async (err, resp) => {
        if(err) return res.json(interal_error);

        // grab the array
        let arr = resp.players;

        // push the added player
        arr.push(ign);

        // set the object array
        resp.players = arr;

        // update the team
        await Team.updateOne(resp);
        
        // create the player
        await player.save().then(() => { res.json({success: true, message: "Player created", code: 200}); }).catch(err => {res.json(internal_error);})

        
       
    });


}

const createTeam = async (req, res) => {

    let name = req.body.name;

    if(!name) return res.json({success: false, message: "Invalid request", code: 400});

    let count = await Team.countDocuments({name: name});

    if(count > 0) return res.json({success: false, message: "Team already exists"});

    let team = Team({name: name, players: [], wins: 0, losses: 0});

    team.save().then(() => {res.json({success: true, message: "Created team", code: 200})}).catch(() => {res.json(internal_error)});

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

const query_round = (uuid) => {
    
    return new Promise(async (resolve, reject) => {
        let count = await Round.countDocuments({UUID: uuid});
        if(!(count > 0)) return reject("Round doesn't exist");

        Round.find({UUID: uuid}, (err, round) => {
            if(err) return reject("Internal Server Error");

            resolve(round);
        });
    });
}

const query_team = (id) => {

    return new Promise(async (resolve, reject) => {
        let count = await Team.countDocuments({name: id});
        if(!(count > 0)) return reject("Team doesn't exist.");

        Team.find({name: id}, (err, team) => {
            if(err) return reject("Internal Error");

            resolve(team);
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

module.exports = { 
    createPlayer: createPlayer, createTeam: createTeam, 
    query_team: query_team, query_player: query_player,
    createTournament: createTournament, createSeason: createSeason,
    query_season: query_season, query_tournaments: query_tournaments,
    createRound: createRound, query_round: query_round, createGame: createGame
};