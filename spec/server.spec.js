process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-sorted"));
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
    it("GET 200 responds with status code of 200", () => {
      return request(server)
        .get("/api/articles/1/comments")
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
    it("GET 400 responds with error message when given invalid id data type", () => {
      return request(server)
        .get("/api/articles/helooooo")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid Id");
        });
    });
  });
});
