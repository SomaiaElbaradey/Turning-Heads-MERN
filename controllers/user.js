const { users, validatePass, validateUser } = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendActivationMail } = require("../helpers/activationMail");
const { sendResetMail } = require("../helpers/resetPassMail");

module.exports.userLogin = async function (req, res) {
  //Checkin if the email exists
  let user = await users.findOne({ mail: req.body.mail });
  if (!user) return res.status(400).send("Invalid mail or password.");

  //Checkin if Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid mail or password.");

  //check mail verification
  if (user.isActive != true)
    res.status(404).send("Please verify your email to login.");

  const webToken = user.generateToken();
  res.send({ webToken, user: user._id });
};

module.exports.userRegister = async function (req, res) {
  //Validate the data of user
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checkin if the email exists
  let user = await users.findOne({ mail: req.body.mail.toLowerCase() });
  if (user) return res.status(409).send("email already exists.");

  //Checkin if the userName exists
  user = await users.findOne({ username: req.body.username });
  if (user) return res.status(409).send("username already exists.");

  //save the user in Database
  let new_user = new users({
    firstName: req.body.firstName,
    mail: req.body.mail,
    password: req.body.password,
    username: req.body.username,
    lastName: req.body.lastName,
    isActive: true,
  });

  //add salt before the hashed password, then hash it.
  const salt = await bcrypt.genSalt(10);
  new_user.password = await bcrypt.hash(new_user.password, salt);

  await new_user.save();

  const token = new_user.generateToken("96h");
  sendActivationMail(new_user.mail, new_user.username, new_user._id);
  //send the id to the user
  res
    .header("x-login-token", token)
    .send({ message: "user was registered successfully, Please login" });
};

//get users
module.exports.getAll = async function (req, res) {
  const allUsers = await users.find({}, { _id: 0, firstName: 1 });
  res.send(allUsers);
};

//delete me
module.exports.deleteMe = async function (req, res) {
  const user = await users.deleteOne({ _id: req.user._id });
  if (!user) return res.status(404).send("the user with given id not existed.");
  res.send(user);
};

//verify user via mail
module.exports.verify = async function (req, res) {
  const { id } = req.params;

  //Checkin if the user exists
  let user = await users.findOne({ _id: id });
  if (!user) return res.status(404).send("user doesn't exist.");

  //change state if exist to be active
  const activate = {
    isActive: true,
  };
  await users.findByIdAndUpdate(id, activate);

  res.status(200);
  res.sendFile("views/activation.html", { root: __dirname });
};

//reset password
module.exports.resetPassword = async function (req, res) {
  // Validate new password
  const { error, value } = validatePass(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  let newPassword = value.newPassword;

  // update the new password with the reseted password
  const user = await users.findOne({ mail: req.body.mail.toLowerCase() });
  if (!user) return res.status(400).send("Invalid mail.");

  // hash the new passsword
  const salt = await bcrypt.genSalt(10);
  newPassword = await bcrypt.hash(newPassword, salt);

  await users.findByIdAndUpdate(user._id, { newPassword });

  sendResetMail(user.mail, user._id);
  res.status(200).send("Check your mail to confirm your new password.");
};

//confirm reseted password
module.exports.confirmPassword = async function (req, res) {
  //find the user
  let user = await users.findById(req.params.id);
  if (!user) return res.status(404).send("user doesn't exist.");
  //update the new password to the user
  let value = {
    password: user.newPassword,
  };
  await users.findByIdAndUpdate(user._id, value);

  res.status(200);
  res.sendFile("views/resetedPassword.html", { root: __dirname });
};

//follow user
module.exports.addFollower = async function (req, res) {
  //find the follower
  let follower = await users.findById(req.user._id);
  if (!follower) return res.status(404).send("follower doesn't exist.");
  //find the folowing
  let following = await users.findById(req.params.id);
  if (!following) return res.status(404).send("user doesn't exist.");
  if (req.user._id == following._id)
    return res.status(404).send("you can't follow yourself dummy!");
  await users.findByIdAndUpdate(follower.id, {
    $addToSet: { following: { _id: following._id } },
  });
  await users.findByIdAndUpdate(following.id, {
    $addToSet: { followers: { _id: follower._id } },
  });
  res.status(200).send(`you have followed ${following.firstName}`);
};

//return names of following
module.exports.followingNames = async function (req, res) {
  const found = await users.findOne({ _id: req.params.id }, "following");
  if (!found) return res.status(404).send("user doesn't exist.");

  let ids = [];
  found.following.forEach((item) => {
    ids.push(item._id.toString());
  });
  let names = [];
  users.find({ _id: { $in: ids } }).then((u) => {
    u.forEach((item) => {
      names.push({ name: `${item.firstName} ${item.lastName}`, _id: item._id });
      return names;
    });
    res.send(names);
  });
};

//return names of followers
module.exports.followersNames = async function (req, res) {
  const found = await users.findOne({ _id: req.params.id }, "followers");
  if (!found) return res.status(404).send("user doesn't exist.");

  let ids = [];
  found.followers.forEach((item) => {
    ids.push(item._id.toString());
  });
  let names = [];
  users.find({ _id: { $in: ids } }).then((u) => {
    u.forEach((item) => {
      names.push({ name: `${item.firstName} ${item.lastName}`, _id: item._id });
      return names;
    });
    res.send(names);
  });
};

//unfollow user
module.exports.unfollow = async function (req, res) {
  if (req.user._id == req.params.userId)
    return res.status(400).send("you cannot unfollow yourself dummy!");

  await users.findOne({ _id: req.user._id }).then((userItem) => {
    const myArr = userItem.following.filter((follower) => {
      return follower._id.toString() == req.params.userId.toString();
    });

    if (myArr.length === 0)
      return res.status(400).send("you already don't follow them");

    const index = userItem.following.findIndex(
      ({ _id }) => _id == req.params.userId
    );
    userItem.following.splice(index, 1);
    userItem.save();
    users
      .findOne({ _id: req.params.userId })
      .then((u) => {
        const index = u.followers.indexOf(req.user._id);
        u.followers.splice(index, 1);
        u.save();
      })
      .catch((e) => res.send(e));
    res.send("you unfollowed them");
  });
};

//return data of one user
module.exports.userData = async function (req, res) {
  const found = await users.findOne({ _id: req.params.id });
  if (!found) return res.status(404).send("user doesn't exist.");

  res.send(found);
};

//return is followed or not
module.exports.isFollowed = async function (req, res) {
  const found = await users.findOne({ _id: req.user._id });
  if (!found) return res.status(404).send("user doesn't exist.");
  let isFollowed = found.following.find(
    (following) => following._id == `${req.params.id}`
  );
  isFollowed ? (isFollowed = true) : (isFollowed = false);
  res.send(isFollowed);
};
