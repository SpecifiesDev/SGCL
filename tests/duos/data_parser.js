const XLSX = require('xlsx');

let workbook = XLSX.readFile('./sheet.xlsx');

// predefined variables

// how many games are on the sheet
let games = 5;

// round name
let name = "3";

// how much is each kill worth
let pointModifier = 3;

// I'm just gonna have it send a response with this.. a lot EASIER
const express = require('express');
const app = express();
app.set('json spaces', 2);

app.get('/pulldata', (req, res) => {init(res)});

app.listen(8080, () => { console.log('server started')});

let init = (res) => {
    
    let teams = new Map();
    let gameArray = [];
    let placements = [];

    let parsedTeams = parseSheetFromRange([65, 67], [1, 12], "Teams");
    let places = parseSheetFromRange([65, 67], [2, 13], "Total");
    

    if(!parsedTeams || parsedTeams == null) return console.log("There was an error with parsing the teams sheet. Check to make sure it's in the sheet.");
    
    for(let l = 0; l < parsedTeams.length; l += 3) teams.set(parsedTeams[l], [parsedTeams[l+1], parsedTeams[l+2]]);
    for(let i = 0; i < places.length; i += 3) placements.push({team: places[i], points: places[i+2], placement: places[i+1]});
    
    
    for(let i = 1; i <= games; i++) {
        
        
        let game = parseSheetFromRange([65, 68], [2, 13], `Game ${i}`);

        
        if(!(game == null)) {

            let teamArray = [];
            for(let k = 0; k < game.length; k+= 4) {

                let team = game[k];
                let place = game[k+1];
                let kills = game[k+2];
                let points = game[k+3];

                let players = teams.get(team);

                let playerStorage = [];


                
                for(player of players) {

                    // this is the only manual code we'll need to change.. I could go through and do it but meh
                    if(i == 1) {
                        let performance = parseSheetFromRange([65, 68], [4, 29], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], deaths: performance[i+2]});
                        }
                    }

                    if(i == 2) {
                        let performance = parseSheetFromRange([69, 71], [4, 29], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }

                    if(i == 3) {
                        let performance = parseSheetFromRange([73, 75], [4, 29], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }

                    if(i == 4) {
                        let performance = parseSheetFromRange([77, 79], [4, 30], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }

                    if(i == 5) {
                        let performance = parseSheetFromRange([81, 83], [4, 30], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }

                    /** 
                    if(i == 6) {
                        let performance = parseSheetFromRange([85, 87], [4, 29], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }

                    
                    if(i == 7) {
                        let performance = parseSheetFromRange([88, 90], [4, 28], "Individual Performance");
                        for(let i = 0; i < performance.length; i += 3) {
                            if(player == performance[i]) playerStorage.push({ign: player, kills: performance[i+1], points: performance[i+1] * pointModifier, deaths: performance[i+2]});
                        }
                    }
                    */
                }


                teamArray.push({ name: team, placement: place, points: points, players: playerStorage});

            
                
            }

            gameArray.push({number: i, teams: teamArray})
        }
    }

    res.json({name: name, placements: placements, games: gameArray});

        
        
    

    
}


// Carson if you need reference to how this system is broken down, I pulled the base system from PVServer/parsing-organizations/App.js parseFromSheet{};

/** 
* @param {Array} letterrange An array specifying the range of letters to pull from the sheet. Should be done using ASCII numbers, the lowest to highest.
* @param {Array} rowrange An array specifying the range of rows. Start with the lowest row, to the highest row.
*/
let parseSheetFromRange = (letterrange, rowrange, sheetName) => {

    let returnArray = [];
    let sheet = workbook.Sheets[sheetName];


    if(!sheet) return null;

    for(let i = rowrange[0]; i <= rowrange[1]; i++) {

        for(let k = letterrange[0]; k <= letterrange[1]; k++) {

            let address = `${String.fromCharCode(k)}${i}`;

            let value = sheet[address];

            if(value) returnArray.push(value.v);

        }

    }

    return returnArray;

}



