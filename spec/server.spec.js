process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("sams-chai-sorted"));
const { expect } = chai;
const request = require("supertest");
const server = require("../server");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET: 200 responds with the status code of 200", () => {
      return request(server)
        .get("/api/topics")
        .expect(200);
    });
    it("GET: 200 returns all the topics", () => {
      return request(server)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          // console.log(response.body);
          expect(response.body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
    it("GET 404 sends error message when path in non existent", () => {
      return request(server)
        .get("/api/topic")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/users", () => {
    it("GET: 200 responds with the status code of 200", () => {
      return request(server)
        .get("/api/users/lurker")
        .expect(200);
    });
    it("Get: 200 responds with the status code of 200 and the user selected by their username", () => {
      return request(server)
        .get("/api/users/lurker")
        .expect(200)
        .then(response => {
          expect(response.body.user.username).to.equal("lurker");
          expect(response.body.user).to.have.keys([
            "username",
            "avatar_url",
            "name"
          ]);
        });
    });
  });
  describe("errors /users", () => {
    it("GET 404 sends error message when username is non-existent ", () => {
      return request(server)
        .get("/api/users/gvhgvhg")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Username does not exist");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET 200 responds with status code of 200 and a new comment count key added to the article object", () => {
      return request(server)
        .get("/api/articles/1/")
        .expect(200)
        .then(response => {
          expect(response.body.article.article_id).to.equal(1);
          expect(response.body.article).to.have.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
        });
    });
    it("GET : 404 responds with error message when id is non existent", () => {
      return request(server)
        .get("/api/articles/400")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Id does not exist");
        });
    });
    it("GET : 400 responds with error message when id is out of range", () => {
      return request(server)
        .get("/api/articles/400000000000")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Data inputted out of range!");
        });
    });
    it("GET 400 responds with error message when given invalid id data type", () => {
      return request(server)
        .get("/api/articles/helooooo")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type inserted");
        });
    });
    it("PATCH : 200 responds with the status code 200 and updates the specific article that amends the votes ", () => {
      return request(server)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(50);
        });
    });
    it("PATCH/ 400 responds with error message when invalid data type is inserted  ", () => {
      return request(server)
        .patch("/api/articles/1")
        .send({ inc_votes: "sdsdf" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type inserted");
        });
    });
    it("PATCH/ 400 responds with error message when extra object added to the object", () => {
      return request(server)
        .patch("/api/articles/1")
        .send({ inc_votes: 1, name: "Mitch" })
        .expect(400)
        .then(response => {
          console.log(response.body);
          expect(response.body.msg).to.equal("Body provided is invalid");
        });
    });
    it("PATCH/ 404 responds with error message when given non-existent Id", () => {
      return request(server)
        .patch("/api/articles/199")
        .send({ inc_votes: -50 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Id does not exist");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST/ 201 responds with the status code 201 and creates a new comment", () => {
      return request(server)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "I hate this article overrated"
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
          expect(response.body.comment.body).to.equal(
            "I hate this article overrated"
          );
        });
    });
    it("POST/ 422 responds with status code 400 when given non-existent article id", () => {
      return request(server)
        .post("/api/articles/2000/comments")
        .send({
          username: "lurker",
          body: "I hate this article overrated"
        })
        .expect(422)
        .then(response => {
          expect(response.body.msg).to.equal(
            "No reference to data in database"
          );
        });
    });
    it("POST/ 422 responds with status code 400 when given non-existent username", () => {
      return request(server)
        .post("/api/articles/1/comments")
        .send({
          username: "mustafa",
          body: "I hate this article overrated"
        })
        .expect(422)
        .then(response => {
          expect(response.body.msg).to.equal(
            "No reference to data in database"
          );
        });
    });
    it("POST/ 400 responds with status code 400 when given no data to add", () => {
      return request(server)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("No data provided");
        });
    });
    it("GET: 200 responds with the article with specific id ", () => {
      return request(server)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.contain.keys([
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          ]);
        });
    });
    it("GET: 200 responds with empty array when no comment exists for the specific Id but articles exists", () => {
      return request(server)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.deep.equal([]);
        });
    });
    it("GET: 200 responds with empty array when no comment exists for the specific Id but articles exists", () => {
      return request(server)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("article does not exist");
        });
    });
  });
  describe("/:article_id/comments ---> queries", () => {
    it("GET : 200 responds with the code 200 and sorts the comments by username zedabetically", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=author")
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET : 400 responds with status code 400 and an error message when given invalid column for query ", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=autho")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid column provided");
        });
    });
    it("GET: 200 responds with status code 200 when comments are ordered by votes in descending order", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=votes&order=desc")
        .expect(200)
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET: 400 responds with status code 400 when incorrect order is requested (not asc/desc)", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=author&order=acsss")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid order requested");
        });
    });
    it("GET: 400 responds with status code 400 when incorrect order is requested (not asc/desc)", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=author&order=deas")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid order requested");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET: 200 responds with an array of articles with the amount of comments included", () => {
      return request(server)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.have.keys([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
        });
    });
    it("GET : 200 responds with the code 200 and sorts the articles by topics zedabetically", () => {
      return request(server)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy("topic", {
            descending: true
          });
        });
    });
    it("GET : 200 responds with the code 200 and sorts the articles by comment_count in ascending order", () => {
      return request(server)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy("comment_count", {
            descending: false
          });
        });
    });
    it("GET : 200 responds with the code 200 and sorts the articles by votes in descending order", () => {
      return request(server)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET : 200 responds with the code 200 and filters the articles by specific topic that is queried", () => {
      return request(server)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(response => {
          const arrayOfArticles = response.body.articles;
          arrayOfArticles.every(article =>
            expect(article.topic).to.equal("cats")
          );
        });
    });
    it("GET : 200 responds with the code 200 and filters the articles by the specified username requested", () => {
      return request(server)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(response => {
          const arrayOfArticles = response.body.articles;
          arrayOfArticles.every(article =>
            expect(article.author).to.equal("icellusedkars")
          );
        });
    });
    it("GET: 400 responds with status code 400 when incorrect column name/does not exist in query", () => {
      return request(server)
        .get("/api/articles?sort_by=topik")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid column provided");
        });
    });
    it("GET: 400 responds with status code 400 when incorrect order is requested (not asc/desc)", () => {
      return request(server)
        .get("/api/articles?sort_by=topic&order=acse")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid order requested");
        });
    });
    it("GET: 404 responds with status code 404 when a author does not exist in the database", () => {
      return request(server)
        .get("/api/articles?author=mustafa")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Author does not exist");
        });
    });
    it("GET: 404 responds with status code 404 when a topic does not exist in the database", () => {
      return request(server)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .then(response => {
          console.log(response.body);
          expect(response.body.msg).to.equal("Topic does not exist");
        });
    });
    it("GET: 200 responds with the status code 200 and empty array when username exists but is not linked to any articles", () => {
      return request(server)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.eql([]);
        });
    });
    it("GET:200 responds with the status code 200 and empty array when topic exists but is not linked to any articles", () => {
      return request(server)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.eql([]);
        });
    });
    it("GET: 200 responds with the status code 200 and empty array when topic and author exists but is not linked to any articles", () => {
      return request(server)
        .get("/api/articles?topic=cats&author=icellusedkars")
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.eql([]);
        });
    });
  });
  describe("/comments/:comment_id", () => {
    it.only("PATCH: 200 responds with status code 200 and updates the votes value by increasing the increment", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          console.log(response.body);
          expect(response.body.comment).to.be.an("object");

          expect(response.body.comment.votes).to.equal(17);
        });
    });
    it("PATCH: 200 responds with status code 200 and updates the votes value by decreasing the increment", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ inc_votes: -6 })
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.be.an("object");
          expect(response.body.comment.votes).to.equal(10);
        });
    });
    it("PATCH: 404 responds with status code 404 when id does not exists", () => {
      return request(server)
        .patch("/api/comments/100")
        .send({ inc_votes: -6 })
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Id does not exist");
        });
    });
    it("PATCH 400 responds with error message when given invalid id data type", () => {
      return request(server)
        .patch("/api/comments/helooooo")
        .send({ inc_votes: -6 })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type inserted");
        });
    });

    it("PATCH/ 400 responds with error message when invalid data type is inserted  ", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ inc_votes: "one" })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type inserted");
        });
    });
    // it("PATCH/ 400 responds with error message when extra object added to the object", () => {
    //   return request(server)
    //     .patch("/api/comments/1")
    //     .send({ inc_votes: 1, name: "Mustafa" })
    //     .expect(400)
    //     .then(response => {
    //       console.log(response.body);
    //       expect(response.body.msg).to.equal("Body provided is invalid");
    //     });
    // });
    // it("PATCH/ 400 responds with error message when object key sent is incorrect", () => {
    //   return request(server)
    //     .patch("/api/comments/1")
    //     .send({ ic_ves: 1 })
    //     .expect(400)
    //     .then(response => {
    //       console.log(response.body);
    //       expect(response.body.msg).to.equal("Body provided is invalid");
    //     });
    // });
    it("PATCH/ 200 responds with nothing update when no data is provided  ", () => {
      return request(server)
        .patch("/api/comments/2")
        .send({})
        .expect(200)
        .then(response => {
          console.log(response.body);
          expect(response.body.comment).to.have.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
        });
    });
    it("DELETE: 204 responds with status code 204 and removes the specific comment and responds with no body", () => {
      return request(server)
        .delete("/api/comments/2")
        .expect(204);
    });
    it("DELETE: 404 responds with error message when id is non-existent", () => {
      return request(server)
        .delete("/api/comments/999")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Id does not exist");
        });
    });
    it("DELETE: 400 responds with error message when id is given as invalid data type", () => {
      return request(server)
        .delete("/api/comments/hi")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type inserted");
        });
    });
  });
  describe("/Invalid Methods ", () => {
    it("responds with 405 when invalid method for route is requested", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(server)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });

      return Promise.all(methodPromises);
    });

    it("responds with status code 405 when invalid method for route is requested", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(server)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });

      return Promise.all(methodPromises);
    });
    it("responds with status code 405 when invalid method for posting a article is requested", () => {
      return request(server)
        .post("/api/articles/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("responds with status code 405 when invalid method for a comment is requested", () => {
      return request(server)
        .put("/api/comments/1")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("responds with status code 405 when invalid method for users route is requested", () => {
      return request(server)
        .put("/api/users/butter_bridge")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("responds with status code 405 when invalid method for specfic route is requested", () => {
      return request(server)
        .put("/api/articles/1/comments")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
    it("responds with status code 405 when invalid method for route is requested", () => {
      return request(server)
        .delete("/api")
        .expect(405)
        .then(response => {
          expect(response.body.msg).to.equal("Method not allowed");
        });
    });
  });
});
