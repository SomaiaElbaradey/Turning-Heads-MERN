const mongoose = require("mongoose");
const server = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe("Blogs CRUD Operations", function () {
  const userId = mongoose.Types.ObjectId();
  const commentId = mongoose.Types.ObjectId();

  it("Post new blog", (done) => {
    const artcilaya = {
      title: "The Psychology of Being Alone in Public",
      body: "When I taught the graduate course, “Singles in Society,” years ago, one of the assignments was for students to go out for a meal by themselves. The students were totally into it. They upped the ante: It had to be dinner, not lunch. And then they upped it again: They could not bring anything to distract them during dinner, such as something to read or to look at. They had to just dine on their own. One undergraduate persuaded me to let her into this graduate class, and when she told her friends about the assignment, they were horrified. They could not imagine going out to dinner by themselves.",
      imgUrl: "https://images.unsplash.com/photo-1473830394358-91588751b241?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      tags: ["Psychology", "Alone"],
      userId,
    };
    chai
      .request(server)
      .post("/api/blog")
      .send(artcilaya)
      .end((err, result) => {
        result.should.have.status(200);
        done();
      });
  });


  it("login", (done) => {
    const user = {
        mail: "somaya@gmail.com",
        password: "Somaya@01",
    };
    chai
      .request(server)
      .post("/api/user/login")
      .send(user)
      .end((err, result) => {
        //   console.log(result);
        result.should.have.status(200);
        done();
      });
  });

//   it("Add new comment", (done) => {
//     const comment = {
//       commenter: "R.E",
//       comment: "this test comment",
//       _id: commentId,
//     };
//     chai
//       .request(server)
//       .post("/api/comment/" + postId)
//       .send(comment)
//       .end((err, result) => {
//         result.should.have.status(200);
//         done();
//       });
//   });

//   it("Add new comment to a deleted post", (done) => {
//     const comment = { commenter: "R.E", comment: "this test comment" };
//     chai
//       .request(server)
//       .post("/api/comment/" + taskId)
//       .send(comment)
//       .end((err, result) => {
//         result.should.have.status(404);
//         done();
//       });
//   });

//   it("Should Fetch all the comments of a post", (done) => {
//     chai
//       .request(server)
//       .get("/api/comment/" + postId)
//       .end((err, result) => {
//         result.should.have.status(200);
//         result.body.Comments.should.be.a("array");
//         done();
//       });
//   });

//   it("Update comment", (done) => {
//     const updatedComment = { comment: "updated" };
//     chai
//       .request(server)
//       .patch(`/api/comment/${postId}/${commentId}/`)
//       .send(updatedComment)
//       .end((err, result) => {
//         result.should.have.status(200);
//         done();
//       });
//   });

//   it("Delete comment", (done) => {
//     chai
//       .request(server)
//       .delete("/api/comment/" + postId + "/" + commentId)
//       .end((err, result) => {
//         result.should.have.status(200);
//         done();
//       });
//   });

//   it("Delete comment on deleted post", (done) => {
//     chai
//       .request(server)
//       .delete("/api/comment/" + taskId + "/" + commentId + "/")
//       .end((err, result) => {
//         result.should.have.status(404);
//         done();
//       });
//   });

//   it("Update comment doesn't exist", (done) => {
//     const updatedComment = { comment: "updated" };
//     chai
//       .request(server)
//       .patch("/api/comment/" + taskId + "/" + commentId + "/")
//       .send(updatedComment)
//       .end((err, result) => {
//         result.should.have.status(404);
//         done();
//       });
//   });
});
