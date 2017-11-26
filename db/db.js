const pg = require('pg');
const query = require('./query');
var pool = new pg.Pool();

//function to set up connection to database
function getConnection(onError, onSuccess) {
    pool.connect(function(err, client, done) {
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
        client.query(paramQuery, params, function (err, result) {
            if (err) {
                console.log(err);
                onError(err);
            } else {
                onSuccess(result.rows);
            }
        });
    }
    getConnection(onError, runQuery);
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

//delete user race
function deleteRace (raceid, userid, onError, onSuccess) {
    dbQuery(query.user.race.remove, [userid, raceid], onError, onSuccess);
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
module.exports = {
    user: {
        add: addUser,
        login: loginUser,
        race: {
            add: addUserRace,
            get: getUserRaces,
            remove: deleteRace
        }
    },
    race: {
        get: getRaceInfo,
        users: getRacers,
        races: getRaces
    }
};