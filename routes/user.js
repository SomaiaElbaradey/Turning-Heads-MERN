const express = require('express');
const userRouter = new express.Router();

const { userLogin, userRegister, getAll, deleteMe, updateMe, verify, unfollow,
    resetPassword, confirmPassword, addFollower, followersNames, followingNames } = require('../controllers/user');

const auth = require('../middlewares/auth');

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.get("/verify/:id", verify);
userRouter.post("/resetPassword/", resetPassword);
userRouter.get("/resetPassword/:id", confirmPassword);
userRouter.post("/newFollow/:id", auth, addFollower);
userRouter.get("/following/:id", auth, followingNames);
userRouter.get("/follower/:id", auth, followersNames);
userRouter.patch("/unfollow/:userId", auth, unfollow);


module.exports = userRouter;