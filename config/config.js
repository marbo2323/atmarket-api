module.exports = {
  // JWT variables
  tokenSecret: process.env.TOKEN_SECRET,

  // Logging variables
  enableGlobalErrorLogging:
    process.env.ENABLE_GLOBAL_ERROR_LOGGING &&
    process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true",

  // Morgan logger format. See details here: https://github.com/expressjs/morgan
  morganFormat: process.env.MORGAN_LOGGER_FORMAT || "dev",
};
