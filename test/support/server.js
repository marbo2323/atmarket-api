var app = require("../../app");
//var debug = require("debug")("atmarket-api:server");
var http = require("http");
//const { sequelize } = require("../../models");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3300");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
//console.log("Port for testing: " + port);
server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = server;
