const { blogs, validateComment } = require("../models/blog");
const { users } = require("../models/user");

//add new comment on one blog
module.exports.addcomment = async function (req, res, next) {
  //find the blog that the comment belongs to
  const article = await blogs.findOne({ _id: req.params.id });
  if (!article) return res.status(404).send("no articles found");

  //link the person who commwnted with his data
  req.body._user = req.user._id;

  //validate the comment
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find commentr
  const commenter = await users.findOne({ _id: req.user._id });
  const user_name = `${commenter.firstName} ${commenter.lastName}`;
  req.body.username = user_name;

  //clone the comments and add the new one
  const comments = article.comment;
  const newComments = [...comments, req.body];

  //update the blog with the new comment
  await blogs.findByIdAndUpdate(article._id, { comment: newComments });
  res.send("comment was added successfully");
};

//return all comments for one article
module.exports.getAllComments = async function (req, res) {
  //find the blog that the comments belong to
  const artcilaya = await blogs.findOne({ _id: req.params.id });
  if (!artcilaya) return res.status(404).send("no articles found");

  res.status(200).send(artcilaya.comment);
};

//retun one comment
module.exports.getComment = async function (req, res, next) {
  try {
    //find the blog that the comment belongs to
    const artcilaya = await blogs.findOne({ _id: req.params.id });
    if (!artcilaya) return res.status(404).send("no articles found");

    //find the wanted comment
    const comments = artcilaya.comment;
    const theComment = comments.find((item) => item._id == req.params.comment);

    res.send(theComment);
  } catch (err) {
    next(err);
  }
};

//delete one comment
module.exports.deleteComment = async function (req, res, next) {
  try {
    //find the blog that the comment belongs to
    const artcilaya = await blogs.findOne({ _id: req.params.id });
    if (!artcilaya) return res.status(404).send("no articles found");

    //allow only the owner of the article to delete comment
    if (artcilaya.userId != req.user._id)
      return res.status(405).send("not allowed operation.");

    //find the wanted comment and remove it
    const comments = artcilaya.comment;
    const newComments = comments.filter(
      (comment) => comment._id != req.params.comment
    );

    //update the blog without the deleted comment
    await blogs.findByIdAndUpdate(artcilaya._id, { comment: newComments });
    res.send("comment deleted");
  } catch (e) {
    next(e);
  }
};

//modify comment
module.exports.updateComment = async function (req, res, next) {
  try {
    //find the blog that the comment belongs to
    const artcilaya = await blogs.findOne({ _id: req.params.id });
    if (!artcilaya) return res.status(404).send("no articles found");

    //find the wanted comment
    let comments = artcilaya.comment;
    const theComment = comments.find((item) => item._id == req.params.comment);

    //allow only the owner of the comment to modify it
    if (theComment._user != req.user._id) 
      return res.status(405).send("not allowed operation.");

    //update comment with the new values
    const commentUpdated = {
      _id: theComment._id,
      username: theComment.username,
      body: req.body.body,
      _user: theComment._user,
    };

    const commentIndex = comments.findIndex(
      (comment) => comment._id == req.params.comment
    );
    comments[commentIndex] = commentUpdated;

    await blogs.findByIdAndUpdate(artcilaya._id, { comment: comments });
    res.send("comment updated");
  } catch (e) {
    next(e);
  }
};
