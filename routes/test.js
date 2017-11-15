/*const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();

pool.connect(function(err,client,done){
    if(err){
        console.log("not able to get connection " + err);

    }


    client.query("SELECT * FROM races ORDER BY raceid", function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            $events = result.rows;
            $json_string = json_encodes($events);
            $file = 'events.js'
            file_put_contents($file, $json_string);


        }
    })
});*/