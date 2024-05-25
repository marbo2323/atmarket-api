const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

describe("API root tests", function () {
  describe("GET /", function () {
    it("Should display welcome message", async () => {
      const res = await chai.request(app).get("/");
      res.should.have.status(200);
    });
  });
});
