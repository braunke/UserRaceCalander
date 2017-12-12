
var _ = require('lodash');

// Chai config

var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../app');
var expect = chai.expect;
const db = require('../db/db');
const pg = require('pg');
var pool = new pg.Pool();
chai.use(chaiHTTP);

describe('race calendar', function() {

    var raceOne = '5k';
    var raceTwo = '10k';
    var raceThree = '15k';



    it('should display the word login on the home page', function(done) {
        chai.request(server)
            .get('/userHome')
            .end(function(err, res) {
                expect(res.status).to.equal(200);
                expect(res.text).to.include('login');
                done();
            });
    });

    it('should give an error if the username / password is incorrect', function(done){
        chai.request(server)
            .post('/login')
            .send({'username' : 'cat' , 'password' : 'dog'})
            .end(function(err, res) {
                expect(res.status).to.equal(200);
                expect(res.text).to.include('Invalid username or password');
                done();
            });
    });

    it('should display user races', function(done){
        chai.request(server)
            .get('/')
            .end(function(err, res){
                expect(res.status).to.equal(200);
                expect(res.text).to.include('about');
                done()
            })
    })
});
