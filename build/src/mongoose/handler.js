const Player = require('./schemas/player');
const Team = require('./schemas/team');

let mongoose = require('mongoose');

const database = "SGCL"

const internal_error = {success: false, message: "Internal Server Error", code: 500};

mongoose.connect(`mongodb+srv://deploy:27plh6RqdQPmYlVF@mineplexstats-3clnx.mongodb.net/${database}?retryWrites=true&w=majority`, { useFindAndModify: true, useUnifiedTopology: true, useNewUrlParser: true}).catch((err) => {console.log(err)});


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

    let player = Player({ign: ign, team: team});

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
        await player.save();

        // return a success code
        res.json({success: true, message: "Player created", code: 200});
    });


}

const createTeam = async (req, res) => {

    let name = req.body.name;

    if(!name) return res.json({success: false, message: "Invalid request", code: 400});

    let count = await Team.countDocuments({name: name});

    if(count > 0) return res.json({success: false, message: "Team already exists"});

    let team = Team({name: name, players: []});

    team.save().then(() => {res.json({success: true, message: "Created team", code: 200})}).catch(() => {res.json(internal_error)});

}

function query_team(id) {

    return new Promise(async (resolve, reject) => {
        let count = await Team.countDocuments({name: id});
        if(!(count > 0)) return reject("Team doesn't exist.");

        Team.find({name: id}, (err, team) => {
            if(err) return reject("Internal Error");

            resolve(team);
        });
    });

}

function populateTestData(num) {
    for(let x = 0; x < num; x++) {
        User({uuid: `${x}`, discord: "x", discordTag: "y", skin: "z"}).save(err => { if(err) return console.log(err); console.log("created");})
    }
}

function findAll() {
    User.find({}, (err, users) => {
        if (err) return console.log(err);
      
        // object of all the users
        console.log(users);
    });
}

// also an exmaple of using async to wait for a value to return
async function findByUUID(uuid) {
    let user = await User.find({uuid: uuid}).catch(err => {console.log(err);});
    console.log(user);
    return user;
}

function findByMongooseAssignedID(id) {
    User.findById(id, (err, user) => {
        if (err) return console.log(err);
      
        // show the one user
        console.log(user);
    });
}

function findAndUpdate(uuid, updatedDiscord) {
    User.findOneAndUpdate({uuid: uuid}, {discord: updatedDiscord}, (err, user) => {
        if(err) return console.log(err);

        // not that this won't display the updated nodule? It updates, but doesn't display. To ensure it updated you'll have to run a requery
        console.log(user);
    });
} 

// This is an example of receiving a user from a secondary function and deleting it. The two functions are interchangable. Just like you can edit this way, you can delete with findOneAndRemove. It's really up to you.
function deleteUser(uuid) {
    User.find({uuid: uuid}, (err, user) => {
        if(err) return console.log(err);

        user.remove(err => {
            if(err) return console.log(err);
            console.log("User deleted");
        })
    });
}

module.exports = { createPlayer: createPlayer, createTeam: createTeam, query_team: query_team };