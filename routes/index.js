var express = require('express');
var router = express.Router();
const db = require('../db/db');
const pg = require('pg');
var pool = new pg.Pool();
//used this to validate passwords
//https://www.npmjs.com/package/validate-password
var ValidatePassword = require('validate-password');
var validator = new ValidatePassword();

function requireLogin(req, res, next) {
    if (!(req.session && req.session.user)) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/about');
});

//page with all the users races
router.get('/userHome', requireLogin, function(req, res, next) {
    var userid  = req.session.user.userid;

    function getRacesError(error) {
        res.status(400).send(error);
    }

    function getRacesSuccess(races) {
        var loggedInUser = req.session.user.username;

        res.render('userHome', {uHomeTabActive: true, userraces: races, username : loggedInUser});
    }

    db.user.race.get(userid, getRacesError, getRacesSuccess);
});

//saving a race to users database
router.post('/save', requireLogin, function(req, res, next) {

    var race = req.body.raceid;
    var userid = req.session.user.userid;
    var intent = req.body.intent;

    function saveRaceError(error) {
        res.status(400).send(err);
    }
    function saveRaceSuccess() {
        res.redirect('/calendar');
    }
    db.user.race.add(race, userid, intent, saveRaceError, saveRaceSuccess);
});

router.post('/registration', function(req, res, next) {
    res.render('createUser');
});

router.get('/login', function(req, res, next) {
    res.render('index', {message : 'Login to use site features'});
});

router.get('/calendar', function(req, res, next) {
    res.render('calendar', {calTabActive: true});
});

router.get('/about', function(req, res, next) {
    res.render('about', {aboutTabActive: true});
});

router.get('/races', function(req, res, next) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send({error: err});
        }
        client.query("SELECT * FROM races", function(err, result) {
            if (err) {
                res.status(400).send({error: err});
            }
            else {
                res.json(result.rows);
            }
        });
    });
});

//page will have info specific to each race and show info about it
router.get('/racePage/:id', requireLogin, function(req, res, next) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var raceid = req.params.id;

        client.query("SELECT * FROM races WHERE raceid=($1) ", [raceid], function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
               raceinfoResult = result.rows;
            }
            client.query('SELECT u.*, i.intentname FROM users u ' +
                'INNER JOIN raceintent ri ON ri.userid = u.userid '  +
                'INNER JOIN intent i ON i.intentid = ri.intentid ' +
                'INNER JOIN races r ON r.raceid = ri.raceid ' +
                'WHERE r.raceid=($1)', [raceid], function(err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result.rows);
                    res.render('racePage', {calTabActive: true, raceinfo : raceinfoResult, racerinfo : result.rows});
                }
            })
        })
    })
});

router.post('/addUser', function(req, res, next) {
    var password = req.body.password;
    var passwordData = validator.checkPassword(password);
    if (passwordData.isValid) {
        var username = req.body.username;
        function addUserError(err) {
            res.status(400).send(err);
        }
        function addUserSuccess() {
            res.redirect('/calendar');
        }
        db.user.add(username, password, addUserError, addUserSuccess);
    }
    else {
        var message = passwordData.validationMessage;
        res.render('createUser', {errorMessage : message});
    }
});

//help with sessions https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    function loginUserError(err) {
        res.status(400).send(err);
    }
    function loginUserSuccess(user) {
        if (user) {
            req.session.user = user;
            res.redirect('/calendar');
        } else {
            res.render('index', {error: 'Invalid username or password'});
        }
    }
    db.user.login(username, password, loginUserError, loginUserSuccess);
});

router.post('/delete', function(req,res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var raceid = req.body.raceid;
        var userid = req.session.user.userid;
        console.log(raceid);
        client.query("DELETE FROM raceintent WHERE userid=($1) AND raceid=($2)", [userid, raceid], function(err, results) {
            if (err) {
                console.log("error querying database " + err);
                res.status(400).send(err);
            }
            else {
                res.redirect('/calendar');
            }
        })
    })
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
