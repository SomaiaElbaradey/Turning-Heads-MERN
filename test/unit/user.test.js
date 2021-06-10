const { users } = require("../../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require('config');

describe("user.generateAuthToken", () => {
  it("should return valid jwt token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new users(payload);

    const token = user.generateToken();
    let decoded = jwt.verify(token, config.get('jwtKey'));

    expect(decoded).toMatchObject(payload);
  });
});
