"use strict";

// prepare path for dotenv preload
// The dotenv config will read .env file path from environment variable DOTENV_CONFIG_PATH
const path = require("node:path");
process.env.DOTENV_CONFIG_PATH = path.resolve(
  process.cwd(),
  "test",
  "support",
  ".env"
);

module.exports = {
  recursive: false,
  timeout: 20000,
  require: ["dotenv/config", "./test/fixtures.js", "./test/hooks.js"],
};
