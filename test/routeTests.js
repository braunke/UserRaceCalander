let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../app');
let expect = chai.expect;

chai.use(chaiHTTP);


// todo you woyld need to set database, connection to test version of your postgres DB

// todo visit routes thst require auth and assert non-logged in user can't addUserSuccess

// add example races, and visit pages about races, assert correct data show on page.



describe('Make sure home page has the right components', function(){

  it('Should show a login form on the home page', function(done) {

    chai.request(server)
    .get('/')
    .end(function(err, res) {
        expect(res).to.have.status(200)
        expect(res.text).to.include('login');
        done();
    });

  });

});


describe("The register function works", function(){

  it("when creating a user with no username and password, it should redirect to register page", function(done){

    chai.request(server)
    .post('addUser')
    .send({})
    .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res).to.redirectTo("/")  // todo need localhost?
        done();
    });

  });




  it("when creating a user with password that doesn't meet requirements, it should redirect to register page including error message", function(done){

    chai.request(server)
    .post('addUser')
    .send({ username: "me", password:"cat"})   // password not secure
    .end(function(err, res){

      console.log(res)

        expect(res).to.have.status(200);   // check if follows redirect ?
        expect(res).to.redirectTo("/")  // todo need localhost?
        expect(res.text).to.include("Your password sucks");
        done();
    })
  })
});


describe("Get race data", function(){

  beforeEach('delete all records and add test data', function(done){
    //
    done();
  });


    afterEach('do cleanup', function(done){
      //
      done();
    });


  it(" should get all races", function(done){
    /* write test here */
    done(); })



});
