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
        client.query('SELECT * FROM users', function (error, result) {
            //for (var i = 0; i < result.rows.length; i++) {
                user = (result.rows[1]);
                username = (user.username)

            //}
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('userHome', {
                user: username
            });
        });
    });
});


module.exports = router;
