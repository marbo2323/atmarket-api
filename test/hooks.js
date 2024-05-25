const { setUpEnv, truncateAllTables } = require("./support/utils");
const { sequelize } = require("../models");

//let transaction;
exports.mochaHooks = {
  transaction: null,

  beforeAll(done) {
    // run once before all tests
    done();
  },

  afterAll(done) {
    // run once after all test
    done();
  },

  beforeEach(done) {
    // do something before every test
    done();
  },

  afterEach(done) {
    // run after every test
    (async function () {
      const cleaned = await truncateAllTables();
      done();
    })();
  },
};
