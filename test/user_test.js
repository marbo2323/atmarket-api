const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const server = require("./support/server");
const {
  getUserByEmail,
  createRegularUser,
  createAdminUser,
} = require("./support/utils");

chai.use(chaiHttp);
chai.should();

describe("API User tests", function () {
  describe("POST /api/v1/users", function () {
    it("Should add a user account", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(201);
    });

    it("Should require a firstName", async () => {
      const userData = {
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("firstName");
      resJson.message.message.should.equal("A firstName is required");
    });

    it("Should require a not empty firstName", async () => {
      const userData = {
        firstName: "",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("firstName");
      resJson.message.message.should.equal("Please provide a firstName");
    });

    it("Should not allow firstName to contain only spaces", async () => {
      const userData = {
        firstName: "  ",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("firstName");
      resJson.message.message.should.equal("Please provide a firstName");
    });

    it("Should require a lastName", async () => {
      const userData = {
        firstName: "Test",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("lastName");
      resJson.message.message.should.equal("A lastName is required");
    });

    it("Should require a not empty lastName", async () => {
      const userData = {
        firstName: "Test",
        lastName: "",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("lastName");
      resJson.message.message.should.equal("Please provide a lastName");
    });

    it("Should not allow lastName to contain only spaces", async () => {
      const userData = {
        firstName: "Test",
        lastName: "   ",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("lastName");
      resJson.message.message.should.equal("Please provide a lastName");
    });

    it("Should validate email", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user",
        password: "Test!9Us3r",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("email");
      resJson.message.message.should.equal(
        "Please provide a valid email address"
      );
    });

    it("Should validate password", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test",
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      res.should.have.status(400);
      const resJson = JSON.parse(res.text);
      resJson.message.path.should.equal("password");
      resJson.message.message.should.equal(
        "The password must be at least 8 characters in length, contain lower and upper letters, numbers and at least one of caracters '.!#%'"
      );
    });

    it("Should not allow save admin user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
        isAdmin: true,
      };
      const res = await chai
        .request(server)
        .post("/api/v1/users")
        .send(userData);

      const savedUser = await getUserByEmail(userData.email);
      res.should.have.status(201);
      savedUser.isAdmin.should.be.false;
    });
  });

  describe("POST /api/v1/users/login", function () {
    it("Should login user and return JWT token", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const savedUser = await createRegularUser(userData);

      const res = await chai
        .request(server)
        .post("/api/v1/users/login")
        .auth(userData.email, userData.password);

      const resJson = JSON.parse(res.text);
      res.should.have.status(200);
      resJson.token.should.be.a("string");
    });
  });

  describe("Get /api/v1/users", function () {
    it("Should not allow regular users to get all users", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const savedUser = await createRegularUser(userData);

      const loginRes = await chai
        .request(server)
        .post("/api/v1/users/login")
        .auth(userData.email, userData.password);

      let resJson = JSON.parse(loginRes.text);
      const token = resJson.token;

      const res = await chai
        .request(server)
        .get("/api/v1/users")
        .set("Authorization", "Bearer " + token);

      resJson = JSON.parse(res.text);
      res.should.have.status(403);
      resJson.message.should.equal("Execute access forbidden");
    });

    it("Should allow admin users to get all users", async () => {
      const userData = {
        firstName: "Admin",
        lastName: "User",
        email: "admin.user@mail.com",
        password: "Test!9Us3r",
      };
      const savedUser = await createAdminUser(userData);

      const loginRes = await chai
        .request(server)
        .post("/api/v1/users/login")
        .auth(userData.email, userData.password);

      let resJson = JSON.parse(loginRes.text);
      const token = resJson.token;

      const res = await chai
        .request(server)
        .get("/api/v1/users")
        .set("Authorization", "Bearer " + token);

      resJson = JSON.parse(res.text);
      res.should.have.status(200);
      resJson.should.be.an("object");
      if (resJson.rows.length) {
        resJson.rows[0].should.be.an("object");
      }
    });
  });

  describe("Get /api/v1/users/:id", function () {
    it("Should allow to request only the user's own data", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const savedUser = await createRegularUser(userData);

      const loginRes = await chai
        .request(server)
        .post("/api/v1/users/login")
        .auth(userData.email, userData.password);

      let resJson = JSON.parse(loginRes.text);
      const token = resJson.token;

      const res = await chai
        .request(server)
        .get("/api/v1/users/" + savedUser.id)
        .set("Authorization", "Bearer " + token);

      resJson = JSON.parse(res.text);
      res.should.have.status(200);
      resJson.should.be.an("object");
    });

    it("Should not allow to request other users data", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test.user@mail.com",
        password: "Test!9Us3r",
      };
      const savedUser = await createRegularUser(userData);

      const loginRes = await chai
        .request(server)
        .post("/api/v1/users/login")
        .auth(userData.email, userData.password);

      let resJson = JSON.parse(loginRes.text);
      const token = resJson.token;

      const res = await chai
        .request(server)
        .get("/api/v1/users/123")
        .set("Authorization", "Bearer " + token);

      resJson = JSON.parse(res.text);
      res.should.have.status(403);
      resJson.message.should.equal("Execute access forbidden");
    });
  });
});
