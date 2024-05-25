"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../config/config");
const { forbiddenError, unauthorizedError } = require("./errors");

// Middleware to authenticate the request using Basic Authentication.
exports.basicAuthenticateUser = async (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  let message; // store the message to display

  if (credentials) {
    const user = await User.findOne({
      where: { email: credentials.name },
    });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        // If the passwords match
        console.log(`Authentication successful for user email: ${user.email}`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for user email: ${user.email}`;
      }
    } else {
      message = `User not found for user email: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    //res.status(401).json({ message: "Access Denied" });
    throw unauthorizedError();
  } else {
    next();
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    throw unauthorizedError();
    // return res.sendStatus(401);
  }

  jwt.verify(token, tokenSecret, async (err, claims) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    const currentUser = await User.findByPk(claims.sub, {
      attributes: ["id", "isAdmin", "firstName", "lastName", "email"],
    });

    if (!currentUser) {
      console.log(
        `User with email: ${claims.email} not found by id: ${claims.sub}`
      );
      //return res.sendStatus(403);
      throw forbiddenError();
    }
    req.currentUser = currentUser;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.currentUser.isAdmin) {
    throw forbiddenError();
  }
  next();
};
