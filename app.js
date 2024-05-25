const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const { notFoundError } = require("./middleware/errors");
const { enableGlobalErrorLogging, morganFormat } = require("./config/config");

// override morgan logger remote user token
logger.token("remote-user", (req) => {
  return req.currentUser ? req.currentUser.email : undefined;
});

const app = express();

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv !== "testing") {
  app.use(logger(morganFormat));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// enable CORS requests
app.use(cors());

app.use("/", indexRouter);
app.use("/api/v1", apiRouter);

// send 404 if no other route matched
app.use((req, res, next) => {
  next(notFoundError("Route Not Found"));
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  let errorMessage = err.message;

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.status = 400;

    const errors = err.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));
    errorMessage = errors.length > 1 ? errors : errors[0];
  }

  res.status(err.status || 500).json({
    message: errorMessage,
  });
});

module.exports = app;
