const express = require('express');
const blogRouter = new express.Router();

const { addOne, deleteOne, updateOne, getAll, getOne, getAllOneUser } = require('../controllers/blog');
const { addcomment, getComment, getAllComments, deleteComment, updateComment } = require('../controllers/comment');

const auth = require('../middlewares/auth');

//articles routes
blogRouter.post("/", auth, addOne);
blogRouter.delete("/:id", auth, deleteOne);
blogRouter.patch("/:id", auth, updateOne);
blogRouter.get("/:uid", getAllOneUser);
blogRouter.get("/", getAll);
blogRouter.get("/get/:id", getOne);

//comments routes
blogRouter.post("/comment/:id", auth, addcomment);
blogRouter.get("/comment/:id/:comment", getComment);
blogRouter.get("/comments/:id", getAllComments);
blogRouter.delete("/comment/:id/:comment", auth, deleteComment);
blogRouter.patch("/comment/:id/:comment", auth, updateComment);

module.exports = blogRouter;
