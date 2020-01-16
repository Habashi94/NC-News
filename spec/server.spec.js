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
          expect(response.body.user[0].username).to.equal("lurker");
          expect(response.body.user[0]).to.have.keys([
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
  describe("/articles", () => {
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
    it("POST/ 400 responds with status code 400 when given non-existent article id", () => {
      return request(server)
        .post("/api/articles/2000/comments")
        .send({
          username: "lurker",
          body: "I hate this article overrated"
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Key (article_id)=(2000) is not present in table "articles".'
          );
        });
    });
    it("POST/ 400 responds with status code 400 when given non-existent username", () => {
      return request(server)
        .post("/api/articles/1/comments")
        .send({
          username: "mustafa",
          body: "I hate this article overrated"
        })
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal(
            'Key (author)=(mustafa) is not present in table "users".'
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
    it("get: 404 responds when no comment exists for the specific Id", () => {
      return request(server)
        .get("/api/articles/3/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("No comment exists");
        });
    });
  });
  describe("/:article/comments/queries", () => {
    it("GET : 200 responds with the code 200 and sorts the comments by username zedabetically", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=author")
        .then(response => {
          expect(response.body.comments).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET : 400 responds with status code 404 and an error message when given invalid column for query ", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=autho")
        .expect(404)
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
  });
  describe.only("/api/articles", () => {
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
    it("GET: 404 responds with status code 404 when incorrect column name/does not exist in query", () => {
      return request(server)
        .get("/api/articles?sort_by=topik")
        .expect(404)
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
  });
});
