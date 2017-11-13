var express = require('express');
var router = express.Router();
const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();
//used this to validate passwords
//https://www.npmjs.com/package/validate-password
var ValidatePassword = require('validate-password');
var validator = new ValidatePassword();

function requireLogin (req, res, next) {
    console.log('in req login');
    if (!(req.session && req.session.user)) {
        res.redirect('/');
        console.log('did redir')
    } else {
        next();
    }
}
//function to set up connection to database
function getConnection(onError, onSuccess){
    pool.connect(function (err, client, done){
        if (err) {
            console.log("not able to get connection " + err);
            onError(err);
        } else {
            onSuccess(client, done);
        }
    });
}
//function to grab user races
function getRaces(userid, onError, onSuccess){
    function fetchRaces(client, done) {
        client.query('SELECT r.* FROM races r ' +
            'INNER JOIN raceintent ri ON ri.raceid = r.raceid ' +
            'INNER JOIN users u ON u.userid = ri.userid ' +
            'WHERE u.userid=($1)', [userid], function(err,result) {
            if (err) {
                console.log(err);
                onError(err);
            } else {
                onSuccess(result.rows);
            }
        });
    }

    getConnection(onError, fetchRaces);
}
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
//page with all the users races
router.get('/userHome', requireLogin, function(req, res, next)
     {
        userid  = req.session.user;

        function getRacesError(error) {
            res.status(400).send(err);
        }

        function getRacesSuccess(races) {
            res.render('userHome',{ userraces: races});
        }

        getRaces(userid, getRacesError, getRacesSuccess);
    });

//saving a race to users database
router.post('/save', function(req, res, next){
    pool.connect(function(err,client,done){
        if (err){
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var race = req.body.raceid;
        var user = req.session.user;
        var intent = req.body.intent;
        client.query( "INSERT INTO raceintent VALUES ($1, $2, $3)"
            , [user, race, intent], function(err,result){
            if(err){
                console.log(err)
            }
            res.render('index')

        });
    })
});
router.post('/registration', function(req, res, next){
    res.render('createUser')
});
router.get('/calendar', function(req, res, next){
    res.render('calendar')
});
router.post('/addUser', function(req, res, next){
    pool.connect(function(err,client,done){
        if(err){
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var password = req.body.password;
        var passwordData = validator.checkPassword(password)
        if (passwordData.isValid) {
            var username = req.body.username;
            client.query("INSERT INTO users (username, userpassword) VALUES ($1, $2)"
                , [username, password], function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('userHome')
                });
        }
        else {
            var message = passwordData.validationMessage;
            res.render('createUser', {errorMessage : message})
        }
    });
});
//help with sessions https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
router.post('/login', function(req, res){
    pool.connect(function(err,client,done){
        if(err){
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var username = req.body.username;
        var password = req.body.password;
        console.log(username, password);
        client.query("SELECT userid FROM users WHERE username=($1) AND userpassword=($2)",[username, password], function (err,result) {
            if (err) {
                res.render('index', {error: 'Invalid username or password'});
            }
            else {
                console.log(result.rows[0].userid);
                req.session.user = result.rows[0].userid;
                res.redirect('userHome')
            }
        })
    });
});

module.exports = router;
