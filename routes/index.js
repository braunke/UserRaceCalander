var express = require('express');
var router = express.Router();
const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();

pool.connect(function (err, client, done) {

    client.query('SELECT $1::varchar AS my_first_query', ['postgres'])
        done();


        console.log(result.rows[0]);
        done()

});
pool.end();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
