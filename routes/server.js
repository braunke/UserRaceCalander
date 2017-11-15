var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var app     = express();
const pg = require('pg');
const conString = 'postgres://kayla:Hank@localhost/postgres';
var pool = new pg.Pool();

app.get('/', function(req, res){

   url = 'http://www.runningintheusa.com/Race/List.aspx?State=MN'
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html)
            var table = $('.horizontalcssmenu table');
            var tablerows = table.find('.MenuGridViewRow, .MenuGridViewAlternatingRow');
            var placeholderArray = [];
            var values = [];
            tablerows.each(function(index) {
                var race = {
                    date: moment($(this).find('td:nth-of-type(2) > div:nth-of-type(3)').text(), 'MMM D, YYYY'),
                    name: $(this).find('td:nth-of-type(3) > a').text(),
                    city: $(this).find('td:nth-of-type(4) > a').text()
                };
                var placeholders = [1, 2, 3, 4];
                var phIndex = index * placeholders.length;
                placeholders = placeholders.map(function(val) {
                    return '$' + (phIndex + val);
                });
                placeholderArray.push('(' + placeholders.join(', ') + ')');
                values.push(race.name, race.date.format('MM/DD/YYYY'), null, race.city);
            });
            var query = 'INSERT INTO races (racename, racedate, racelink, racelocation) VALUES ' + placeholderArray.join(', ');
            pool.connect(function(err,client,done){
                if(err){
                    console.log("not able to get connection " + err);
                    res.send('whoops');
                }
                client.query(query, values, function (err,result) {
                    if (err) {
                        console.log(err);
                        res.send('whoops');
                    }
                    else {
                        res.send('done');
                    }
                })
            });
        } else {
            console.log('maybe');
            res.send('whoops');
        }
    })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;