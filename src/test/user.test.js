let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

chai.use(chaiHttp)
chai.should()

describe("/users", () => {
  it ("it should be create new users", (done) => {
    const users = {
      first_name: "rifqi riza",
      last_name: "irfansyah",
      birthday: "2022-12-27",
      location: "Europe/Rome"
    }

    chai.request(server).post("/users").send(users).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a("object")
      done()
    })
  })
})

describe("/users/:id", () => {
  it ("it should be DELETE user by Name", (done) => {
    const id = "63ab292a2aa32459c8ac2d4d";
    chai
      .request(server)
      .delete("/users/" + id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object")
        done()
     })
  })
})