const pg = require('pg');
const query = require('./query');
var pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

//function to set up connection to database
function getConnection(onError, onSuccess) {
    pool.query(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            onError(err);
        } else {
            onSuccess(client, done);
        }
    });
}

//function to get connection and query database
function dbQuery(paramQuery, params, onError, onSuccess) {
    function runQuery(client, done) {
        pool.query(paramQuery, params, function (err, result) {
            if (err) {
                console.log(err);
                onError(err);
            } else {
                onSuccess(result.rows);
            }
        });
    }
    runQuery()
}

//function to grab user races
function getUserRaces(userid, onError, onSuccess) {
    dbQuery(query.user.race.get, [userid], onError, onSuccess);
}

function addUserRace(race, user, intent, onError, onSuccess) {

    dbQuery(query.user.race.add, [user, race, intent], onError, onSuccess);
}

//function to add a new user
function addUser(username, password, onError, onSuccess) {
    dbQuery(query.user.add, [username, password], onError, onSuccess);
}

//function to login
function loginUser(username, password, onError, onSuccess) {
    dbQuery(query.user.login, [username, password], onError, function(users) {
        if (users.length) {
            onSuccess(users[0]);
        } else {
            onSuccess();
        }
    });
}
//checks if user has selected race already
function checkRaces (race, user, intent, onError, onSuccess){
    dbQuery(query.user.race.check, [user, race, intent], onError, function(races){
        if (races.length) {
            onSuccess(races[0]);
        } else {
            onSuccess();
        }
    })
}

//delete user race
function deleteRace (raceid, userid, onError, onSuccess) {
    dbQuery(query.user.race.remove, [raceid, userid], onError, onSuccess);
}
//show race info
function getRaceInfo (raceid, onError, onSuccess) {
    dbQuery(query.race.get, [raceid], onError, function(races) {
        if (races.length) {
            onSuccess(races[0]);
        } else {
            onSuccess();
        }
    });
}
 //shows users interested in a race
function getRacers (raceid, onError, onSuccess) {
    dbQuery(query.race.users, [raceid], onError, onSuccess);
}

//gets all races
function getRaces (onError, onSuccess) {
    dbQuery(query.race.races, [], onError, onSuccess);
}
//checks if user has selected race already
module.exports = {
    user: {
        add: addUser,
        login: loginUser,
        race: {
            add: addUserRace,
            get: getUserRaces,
            remove: deleteRace,
            check: checkRaces

        }
    },
    race: {
        get: getRaceInfo,
        users: getRacers,
        races: getRaces
    }
};