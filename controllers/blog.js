const { blogs, validateBlog } = require("../models/blog");

//return all for one user
module.exports.getAllOneUser = async function (req, res) {
  const articles = await blogs.find({ userId: req.params.uid });
  if (!articles) return res.status(404).send("not found");

  res.json(articles);
};

//return all
module.exports.getAll = async function (req, res) {
  const articles = await blogs.find({});
  res.json(articles);
};

//retun one article
module.exports.getOne = async function (req, res, next) {
  try {
    const artcilaya = await blogs.findOne({ _id: req.params.id });
    if (!artcilaya)
      return res.status(404).send("the artcilaya with given id not existed.");
    res.send(artcilaya);
  } catch (err) {
    next(err);
  }
};

//modify article
module.exports.updateOne = async function (req, res, next) {
  try {
    const found = await blogs.findOne({ _id: req.params.id });
    if (!found) return res.status(404).send("not found");

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
    if (!deleted) return res.status(404).send("no articles found");
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

// router.put("/", verify, async (req, res, next) => {
//   try {
//     const id = req.user._id;
//     const found = await user.findOne({ _id: id });
//     if (!found) return res.send("errrr");
//     found.title = req.body.title;

//     await found.save();
//     res.send("edited successfully");
//   } catch (e) {
//     next(e);
//   }
// });

// router.get("/", paginatedResults(article), async (req, res, next) => {
//   res.json(res.paginated);
// });

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex);

      res.paginated = results;
      next();
    } catch (e) {
      next(e);
    }
  };
}
