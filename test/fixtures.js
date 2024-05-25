const { startDb, stopDb } = require("./support/utils");

exports.mochaGlobalSetup = async function () {
  await startDb();
};

exports.mochaGlobalTeardown = async function () {
  await stopDb();
};
