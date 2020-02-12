process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
chai.use(chaiSorted);
chai.use(require("sams-chai-sorted"));

after(() => {
  connection.destroy();
});

beforeEach(() => {
  return connection.seed.run();
});

describe("/api", () => {
  it("ERROR 404: responds with a 404 when given an incorrect path", () => {
    return request(app)
      .get("/api/incorrect_path")
      .expect(404)
      .then(response => {
        expect(response.body.msg).to.equal("404 Route not found");
      });
  });
  describe("/topics", () => {
    it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid method");
          });
      });
      return Promise.all(promiseArray);
    });
    describe("GET", () => {
      it("200 responds with a named array of topic objects, each topic having correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            expect(response.body.topics).to.be.an("array");
            expect(response.body.topics[0]).to.contain.keys(
              "description",
              "slug"
            );
            expect(response.body.topics.length).to.equal(3);
          });
      });
    });
  });
  describe("users", () => {
    describe("/:username", () => {
      it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
        const invalidMethods = ["delete", "post", "put"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users/butter_bridge")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(promiseArray);
      });
      describe("GET", () => {
        it("200 responds with correct status code and individual user", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(response => {
              expect(response.body.user).to.be.an("object");
              expect(response.body.user).to.contain.keys(
                "username",
                "name",
                "avatar_url"
              );
              expect(response.body.user.username).to.equal("butter_bridge");
            });
        });
        it("ERROR 404 - correct path with incorrect username", () => {
          return request(app)
            .get("/api/users/1")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("User not found");
            });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("/:id", () => {
      it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
        const invalidMethods = ["delete", "post"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(promiseArray);
      });
      describe("GET", () => {
        it("200 responds with correct status code and individual user", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body.article).to.be.an("object");
              expect(response.body.article).to.contain.keys(
                "article_id",
                "votes",
                "title",
                "topic",
                "author",
                "body",
                "created_at",
                "comment_count"
              );
              expect(response.body.article.article_id).to.equal(1);
              expect(response.body.article.comment_count).to.equal("13");
            });
        });
        it("ERROR 404 - correct path with non existent id", () => {
          return request(app)
            .get("/api/articles/400")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("User not found");
            });
        });
      });
      describe("PATCH", () => {
        it("201 responds with correct status code and the updated article", () => {
          return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: 5 })
            .expect(201)
            .then(response => {
              expect(response.body.article.votes).to.equal(5);
            });
        });
        it("ERROR 400 - correct path bad request", () => {
          return request(app)
            .patch("/api/articles/not_an_id")
            .send({ inc_votes: 5 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR 404 - correct path with non existent id", () => {
          return request(app)
            .patch("/api/articles/400")
            .send({ inc_votes: 5 })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("User not found");
            });
        });
      });
      describe("/comments", () => {
        describe("POST", () => {
          it("201 responds with correct status code and the updated article", () => {
            return request(app)
              .post("/api/articles/5/comments")
              .send({ username: "robin", body: "hello there" })
              .expect(201)
              .then(response => {
                expect(response.body.comment).to.contain.keys(
                  "username",
                  "body"
                );
              });
          });
          it("ERROR 400 - correct path bad request", () => {
            return request(app)
              .post("/api/articles/not_an_id/comments")
              .send({ username: "robin", body: "hello there" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 404 - correct path with non existent id", () => {
            return request(app)
              .patch("/api/articles/400/comments")
              .send({ username: "robin", body: "hello there" })
              .expect(404)
              .then(response => {
                expect(response.body.msg).to.equal("Article not found");
              });
          });
        });
      });
    });
  });
});
