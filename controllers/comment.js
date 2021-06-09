const { blogs, validateBlog } = require("../models/blog");

//modify article
module.exports.updateOne = async function (req, res, next) {
  try {
    const found = await blogs.findOne({ _id: req.params.id });
    if (!found) return res.send("not found");

    Object.keys(req.body).forEach((key) => {
      found[key] = req.body[key];
    });

    await found.save();
    res.send(found);
  } catch (e) {
    next(e);
  }
};

//delete article
module.exports.deleteOne = async function (req, res, next) {
  try {
    const deleted = await blogs.deleteOne({ _id: req.params.id });
    if (!deleted) return res.send("no articles found");
    res.send("article deleted");
  } catch (e) {
    next(e);
  }
};

//add article
module.exports.addOne = async function (req, res, next) {
  const { error } = validateBlog(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const articleCreated = new blogs({
      title: req.body.title,
      body: req.body.body,
      imgUrl: req.body.imgUrl,
      tags: req.body.tags,
      userId: req.user._id,
      comment: [],
    });
    await articleCreated.save();
    res.send("article was added successfully");
  } catch (e) {
    next(e);
  }
};

//retun one article
module.exports.getOne = async function (req, res, next) {
  try {
    const artcilaya = await blogs.findOne({ _id: req.params.id });
    res.send(artcilaya);
  } catch (err) {
    next(err);
  }
};
