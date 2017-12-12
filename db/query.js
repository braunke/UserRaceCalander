var getUserRaces =
    'SELECT r.* , i.intentname ' +
    'FROM races r ' +
    ' INNER JOIN raceintent ri ON ri.raceid = r.raceid ' +
    ' INNER JOIN intent i ON i.intentid = ri.intentid ' +
    ' INNER JOIN users u ON u.userid = ri.userid ' +
    'WHERE u.userid=($1)';

var addUserRace =
    'INSERT INTO raceintent ' +
    ' VALUES ($1, $2, $3)';

var addUser =
    'INSERT INTO users (userid, username, userpassword) ' +
    ' VALUES ($1, $2, $3)';

var getLastUser =
    'SELECT userid FROM users ' +
    'ORDER BY userid DESC LIMIT 1 ';

var loginUser =
    'SELECT * ' +
    'FROM users ' +
    'WHERE username=($1) AND userpassword=($2)';

var deleteRace =
    'DELETE FROM raceintent ' +
    'WHERE raceid=($1) ' +
    'AND userid=($2)';

var getRacers =
    'SELECT u.*, i.intentname FROM users u ' +
    'INNER JOIN raceintent ri ON ri.userid = u.userid '  +
    'INNER JOIN intent i ON i.intentid = ri.intentid ' +
    'INNER JOIN races r ON r.raceid = ri.raceid ' +
    'WHERE r.raceid=($1)';

var getRaceInfo =
    "SELECT * FROM races " +
    "WHERE raceid=($1) ";

var getRaces =
    'SELECT * FROM races';
var checkRaces =
    'SELECT * FROM raceintent ' +
    'WHERE userid=($1) AND raceid=($2) ';
module.exports = {
    user: {
        add: addUser,
        login: loginUser,
        last: getLastUser,
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