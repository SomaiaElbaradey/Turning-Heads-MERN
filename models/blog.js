const mongoose = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const commentsSchema = new mongoose.Schema({
  body: {
    type: String
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  _user:{
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  picture: {
    type: String
  },
  created_at: {
    type: Date, 
    required: true, 
    default: Date.now
  },
  likes:{
    type: Number
  }
});

// Schema
const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    minlength: 2,
    maxlength: 60,
  },
  body: {
    type: String,
    minlength: 60,
    maxlength: 1000,
  },
  imgUrl: {
    type: String,
  },
  tags: {
    type: [String],
    maxlength: 100,
  },
  comment: {
    type: [commentsSchema],
    default: [{}],
  },
});

module.exports.blogs = mongoose.model("Blog", schema);

//validate blog
function validateBlog(Blog) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(60),
    body: Joi.string().min(60).max(1000),
    imgUrl: Joi.string(),
    tags: Joi.array(),
  });

  return schema.validate(Blog);
}
module.exports.validateBlog = validateBlog;

//validate comment
module.exports.validateComment = function validateComment(comment) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    body: Joi.string(), 
    _user: Joi.objectId().required(),
  });
  return schema.validate(comment);
};