const express = require('express');
const userRouter = new express.Router();

const { userLogin, userRegister, getAll, deleteMe, updateMe, verify,
    resetPassword, confirmPassword } = require('../controllers/user');

const auth = require('../middlewares/auth');

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.get("/verify/:id", verify);
userRouter.post("/resetPassword/", resetPassword);
userRouter.get("/resetPassword/:id", confirmPassword);

module.exports = userRouter;