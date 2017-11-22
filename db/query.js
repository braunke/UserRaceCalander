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
    'INSERT INTO users (username, userpassword) ' +
    ' VALUES ($1, $2)';

var loginUser =
    'SELECT * ' +
    'FROM users ' +
    'WHERE username=($1) AND userpassword=($2)';

module.exports = {
    user: {
        add: addUser,
        login: loginUser,
        race: {
            add: addUserRace,
            get: getUserRaces
        }
    }
};