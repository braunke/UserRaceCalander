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
        res.status(400).send(error);
    }
    function saveRaceSuccess() {
        res.redirect('/userHome');
    }
    function checkRaceSuccess(races) {
        if (races){
            res.render('racePage', {'message' : 'You have already selected this race!'})
        }
        else{
            db.user.race.add(race, userid, intent, saveRaceError, saveRaceSuccess);
        }
    }
    db.user.race.check(race, userid, intent, saveRaceError, checkRaceSuccess)
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
    function getRaceError(err) {
        res.status(400).send(err);
    }
    function getRaceSuccess(races) {
        res.json(races);
    }
    db.race.races(getRaceError, getRaceSuccess);
});

//page will have info specific to each race and show info about it
router.get('/racePage/:id', requireLogin, function(req, res, next) {
    var raceid = req.params.id;

    function error(err) {
        res.status(400).send(err);
    }
    function raceInfoSuccess(race) {
        function informationSuccess(users) {
            res.render('racePage', {calTabActive: true, race : race, racerinfo : users});
        }
        db.race.users(raceid, error, informationSuccess);
    }
    db.race.get(raceid, error, raceInfoSuccess);

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
    if (username && password) {
        db.user.login(username, password, loginUserError, loginUserSuccess);
    } else {
        res.render('index', {error: 'Must enter username and password'});
    }
});
router.post('/delete', function(req,res) {
    var raceid = req.body.raceid;
    var userid = req.session.user.userid;

    function deleteRaceError(err) {
        res.status(400).send(err);
    }
    function deleteRaceSuccess() {
        res.redirect('/calendar');
    }
    db.user.race.remove(raceid, userid, deleteRaceError, deleteRaceSuccess);

});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
