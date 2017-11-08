var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

   url = 'http://www.runningintheusa.com/Race/List.aspx?State=MN'
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html)
            var name, date, link;
            var json = {name : "", date : "", link : ""};
        }
    })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;