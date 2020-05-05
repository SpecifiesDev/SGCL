const Player = require('./schemas/player');

let mongoose = require('mongoose');

const database = "SGCL"

mongoose.connect(`mongodb+srv://deploy:27plh6RqdQPmYlVF@mineplexstats-3clnx.mongodb.net/${database}?retryWrites=true&w=majority`, {useUnifiedTopology: true, useNewUrlParser: true}).catch((err) => {console.log(err)});


function createPlayer(req, res) {

    let ign = req.body.ign;
    let team = req.body.team;

    Player.countDocuments({ign: ign}, (err, count) => {
        if(count > 0 || err) return res.json({success: false, message: "Player already exists"});

        
    })

    return new Promise((resolve, reject) => {

        Player.countDocuments({ign: ign}, (err, count) => { 
            if(count > 0 || err) return reject();
            let player = Player({ign: ign, team: team});

            player.save(err => {
                if(err) return reject();
                resolve();
            });
            
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

module.exports = { createPlayer: createPlayer };