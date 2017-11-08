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
//help with sessions https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
router.post('/login', function(req, res){
    req.session.user = 1;
    res.redirect('/userHome')
});
module.exports = router;
