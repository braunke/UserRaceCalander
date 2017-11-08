var express = require('express');
var router = express.Router();
const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
//page with all the users races
router.get('/userHome', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        //will eventually be all the races you can choose from
        client.query('SELECT * FROM races', function (error, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('userHome', {
                races: result.rows
            });
        });
    });
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
router.post('/addUser', function(req, res, next){
    pool.connect(function(err,client,done){
        if(err){
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query("SELECT userid FROM users ORDER BY userid DESC LIMIT 1",
        function(er, result){
            if(err){
                console.log(err)
            }
            {

                var lastUserId = result.rows[0].userid
                console.log(lastUserId)
                var userid = lastUserId + 1
                var username = req.body.username;
                var password = req.body.password;
                client.query("INSERT INTO users VALUES($1, $2, $3)"
                    , [userid, username, password], function (err, result) {
                        if (err) {
                            console.log(err)
                        }
                        res.render('userHome')
                    })
            }
            })

            })

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
        client.query("SELECT userid FROM users WHERE username=($1) AND password=($2)",[username, password], function (err,result) {
            if (err) {

                res.render('index', {error: 'Invalid username'});
            } else {
                console.log(result.rows[0].userid)
                req.session.user = result.rows[0].userid
                res.redirect('/userHome')
            }
        })
    });


});
module.exports = router;
