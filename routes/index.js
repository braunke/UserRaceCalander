var express = require('express');
var router = express.Router();
const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();

pool.connect(function (err, client, done) {

    if (err)
        console.log(err);

    client.query('SELECT * FROM users', function(error, result) {
        for (var i = 0; i < result.rows.length; i++) {
            console.log(result.rows[i]);
        }
    });

});
pool.end();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
