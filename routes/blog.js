const express = require('express');
const blogRouter = new express.Router();

const { addOne, deleteOne, updateOne, getAll, getOne, getAllOneUser } = require('../controllers/blog');

const auth = require('../middlewares/auth');

blogRouter.post("/", auth, addOne);
blogRouter.delete("/:id", auth, deleteOne);
blogRouter.patch("/:id", auth, updateOne);
blogRouter.get("/:uid", getAllOneUser);
blogRouter.get("/", getAll);
blogRouter.get("/get/:id", getOne);

module.exports = blogRouter;
