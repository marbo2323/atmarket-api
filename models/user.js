"use strict";
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A firstName is required" },
          notEmpty: { msg: "Please provide a firstName" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "A lastName is required" },
          notEmpty: { msg: "Please provide a lastName" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "The email You entered already exists" },
        validate: {
          notNull: { msg: "An email is required" },
          notEmpty: { msg: "Please provide an email" },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          // save the original password value supplied by user  for later strength validation
          this.rawPass = val;
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
        validate: {
          notNull: { msg: "A password is required" },
          notEmpty: { msg: "Please provide a password" },
          isStrongEnough(value) {
            const regex =
              /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^.!#%]*[.!#%])[A-Za-z0-9.!#%]{8,32}$/g;
            const isStrong = regex.test(this.rawPass);
            if (!isStrong) {
              throw new Error(
                "The password must be at least 8 characters in length, contain lower and upper letters, numbers and at least one of caracters '.!#%'"
              );
            }
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    { sequelize, tableName: "user" }
  );

  return User;
};
