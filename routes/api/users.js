const express = require("express");
const { asyncHandler } = require("../../middleware/async-handler");
const {
  basicAuthenticateUser,
  authenticateToken,
  isAdmin,
} = require("../../middleware/auth-user");
const { User } = require("../../models");
const { generateAccessToken } = require("../../middleware/utils");
const { tokenSecret } = require("../../config/config");
const { forbiddenError } = require("../../middleware/errors");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  isAdmin,
  asyncHandler(async (req, res) => {
    if (!req.currentUser.isAdmin) {
      throw forbiddenError();
    }

    let { limit, offset } = req.query;
    limit = limit || 50;
    offset = offset || 0;

    const users = await User.findAndCountAll({
      attributes: [
        "id",
        "isAdmin",
        "firstName",
        "lastName",
        "email",
        "createdAt",
      ],
      limit,
      offset,
    });
    res.json(users);
  })
);

router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    //console.log(req.currentUser);
    if (req.currentUser.id !== parseInt(id)) {
      throw forbiddenError();
    }

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "isAdmin",
        "firstName",
        "lastName",
        "email",
        "createdAt",
      ],
    });
    res.json(user);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    // set isAdmin explicitly false
    const userData = {
      ...req.body,
      isAdmin: false,
    };
    await User.create(userData);
    res.status(201).location("back").end();
  })
);

router.post(
  "/login",
  basicAuthenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const token = generateAccessToken(
      { email: user.email, sub: user.id },
      tokenSecret,
      "30 d"
    );
    res.json({ token });
  })
);

module.exports = router;
