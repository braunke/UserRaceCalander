


// Chai config

var chai = require('chai');
var chaiHTTP = require('chai-http');
var server = require('../app');
var expect = chai.expect;

chai.use(chaiHTTP);

it('should display the word login on the home page', function(done) {

    chai.request(server)
    .get('/')
    .end(function(err, res){
    expect(res.status).to.equal(200);
    expect(res.text).to.include('login');


    return done();
});
});



