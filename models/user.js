const mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

const mongoose = require("mongoose");
const config = require("config");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");

// Schema
const schema = new mongoose.Schema({
  mail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    minlength: 6,
    maxlength: 64,
    match: mailRegExp,
  },
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 7,
    maxlength: 64,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  newPassword: {
    type: String,
    minlength: 8,
    maxlength: 1024,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  following: {
    type: [{ _Id: mongoose.Types.ObjectId }],
  },
  followers: {
    type: [{ follower_Id: mongoose.Types.ObjectId }],
  },
});

// JWT generation method
schema.methods.generateToken = function (expiry) {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtKey"),
    { expiresIn: expiry }
  );
};
module.exports.users = mongoose.model("User", schema);

function validateUser(user) {
  const schema = Joi.object({
    mail: Joi.string().email().required().trim().lowercase().min(6).max(64),
    userName: Joi.string().required().trim().min(7).max(64),
    firstName: Joi.string().min(3).max(15).trim().required(),
    lastName: Joi.string().min(3).max(15).trim().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z]).{8,}$"))
      .messages({
        "string.pattern.base":
          "your password must have at least 1 upper case letter, 1 special character, 1 small case letter",
      }),
    age: Joi.number().min(13),
  });

  return schema.validate(user);
}
module.exports.validateUser = validateUser;

//validate the upated password
module.exports.validatePass = function validatePass(user) {
  const schema = Joi.object({
    mail: Joi.string().email().required().trim().lowercase().min(6).max(64),
    newPassword: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z]).{8,}$"))
      .messages({
        "string.pattern.base":
          "your password must have at least 1 upper case letter, 1 special character, 1 small case letter",
      }),
  });
  return schema.validate(user);
};