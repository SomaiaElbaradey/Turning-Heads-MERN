let server;
const request = require("supertest");
const { blogs } = require("../../models/blog");
const mongoose = require("mongoose");
const { users } = require("../../models/user");

describe("Blogs CRUD Operations", function () {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    server.close();
    await blogs.remove({});
  });

  //testing the get operations for blogs
  describe("GET ALL/", () => {
      //getting all the blogs test
    it("Get all blogs", async () => {
        //insert dummy blogs to test getting them
      await blogs.collection.insertMany([
        {
          title: "The Psychology of Being Alone",
          body: "When I taught the graduate course, “Singles in Society,” years ago, one of the assignments was for students to go out for a meal by themselves. The students were totally into it. They upped the ante: It had to be dinner, not lunch. And then they upped it again: They could not bring anything to distract them during dinner, such as something to read or to look at. They had to just dine on their own. One undergraduate persuaded me to let her into this graduate class, and when she told her friends about the assignment, they were horrified. They could not imagine going out to dinner by themselves.",
          imgUrl:
            "https://images.unsplash.com/photo-1473830394358-91588751b241?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
          tags: ["Psychology", "Alone"],
          userId: mongoose.Types.ObjectId("60c1741b593fd96c3752d4f3"),
        },
        {
          title: "Being Alone in Public",
          body: "When I taught the graduate course, “Singles in Society,” years ago, one of the assignments was for students to go out for a meal by themselves. The students were totally into it. They upped the ante: It had to be dinner, not lunch. And then they upped it again: They could not bring anything to distract them during dinner, such as something to read or to look at. They had to just dine on their own. One undergraduate persuaded me to let her into this graduate class, and when she told her friends about the assignment, they were horrified. They could not imagine going out to dinner by themselves.",
          imgUrl:
            "https://images.unsplash.com/photo-1473830394358-91588751b241?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
          tags: ["Psychology", "Public"],
          userId: mongoose.Types.ObjectId("60c1741b593fd96c3752d4f3"),
        },
      ]);
      const res = await request(server).get("/api/blog");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((articlya) => articlya.title === "Being Alone in Public")
      );
      expect(
        res.body.some(
          (articlya) => articlya.title === "The Psychology of Being Alone"
        )
      );
    });
  });

  //test to get unexisting blog 
  describe("GET ONE/", () => {
    it("Get unexisting blog", async () => {
        //random id doesn't exist on db
      const blogId = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/blog/get/${blogId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST ONE/", () => {
      //initial values to modify while testing
    let token;
    let body =
      "When I taught the graduate course, “Singles in Society,” years ago, one of the assignments was for students to go out for a meal by themselves. The students were totally into it. They upped the ante: It had to be dinner, not lunch. And then they upped it again: They could not bring anything to distract them during dinner, such as something to read or to look at. They had to just dine on their own. One undergraduate persuaded me to let her into this graduate class, and when she told her friends about the assignment, they were horrified. They could not imagine going out to dinner by themselves.";

      //general method to generate token to use in testing
    const genToken = () => {
      const payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };
      const user = new users(payload);
      token = user.generateToken();
    };

    //general method to avoid duplication for post request tests
    const exec = async () => {
      return await request(server)
        .post(`/api/blog/`)
        .set("x-login-token", token)
        .send({
          title: "Being Alone 03",
          body,
          imgUrl:
            "https://images.unsplash.com/photo-1473830394358-91588751b241?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
          tags: ["Psychology", "Public"],
        });
    };

    // test to ensure error when posting fromm unassigned user
    it("return 401 if user is not logged in", async () => {
      //assign tken to empty string for un signedin user
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    // test to ensure error when article has unvalid value
    it("return 400 if aticle is not valid - body length is less than min", async () => {
      genToken();
      body = "when..";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    // test to ensure posting is done when article is valid
    it("save the article if it's valid", async () => {
      genToken();
      body =
        "When I taught the graduate course, “Singles in Society,” years ago, one of the assignments was for students to go out for a meal by themselves. The students were totally into it. They upped the ante: It had to be dinner, not lunch. And then they upped it again: They could not bring anything to distract them during dinner, such as something to read or to look at. They had to just dine on their own. One undergraduate persuaded me to let her into this graduate class, and when she told her friends about the assignment, they were horrified. They could not imagine going out to dinner by themselves.";
      const res = await exec();
      const article = await blogs.find({ title: "Being Alone 03" });
      expect(article).not.toBeNull();
      expect(res.status).toBe(200);
    });
  });
});
