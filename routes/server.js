var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var app     = express();

app.get('/', function(req, res){

   url = 'http://www.runningintheusa.com/Race/List.aspx?State=MN'
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html)
            var table = $('.horizontalcssmenu table');
            var tablerows = table.find('.MenuGridViewRow, .MenuGridViewAlternatingRow');
            tablerows.each(function() {
                var race = {
                    date: moment($(this).find('td:nth-of-type(2) > div:nth-of-type(3)').text(), 'MMM D, YYYY'),
                    name: $(this).find('td:nth-of-type(3) > a').text(),
                    city: $(this).find('td:nth-of-type(4) > a').text()
                };
                console.log([race.date.format('MM/DD/YYYY'), race.name, race.city].join(' | '));
            });

            res.send('done');
        } else {
            res.send('whoops');
        }
    })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;