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
      });
    });
  });
  describe("/articles", () => {
    it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
      const invalidMethods = ["patch", "delete", "post"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid method");
          });
      });
      return Promise.all(promiseArray);
    });
    describe("GET", () => {
      it("status 200, returns array of all article with default sorting", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(12);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 200, returns array of all article with author sorting", () => {
        return request(app)
          .get("/api/articles/?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(3);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 200, returns array of all article with topic sorting", () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(11);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
    });
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
              expect(response.body.msg).to.equal(
                "Correct path, selection not found"
              );
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
              expect(response.body.msg).to.equal(
                "Correct path, selection not found"
              );
            });
        });
      });
      describe("/comments", () => {
        it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
          const invalidMethods = ["put", "delete"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid method");
              });
          });
          return Promise.all(promiseArray);
        });
        describe("POST", () => {
          it("201 responds with correct status code and the updated article", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "butter_bridge", body: "hello there" })
              .expect(201)
              .then(response => {
                expect(response.body.addedComment).to.contain.keys(
                  "author",
                  "body",
                  "comment_id",
                  "article_id",
                  "votes",
                  "created_at"
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
          it("ERROR 404/422 - correct path with non existent id", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "robin", body: "hello there" })
              .expect(422)
              .then(response => {
                expect(response.body.msg).to.equal("Unprocessable input");
              });
          });
        });
        describe("GET", () => {
          it("responds with a 200 status code and retrieved comments, sorted with created_at desc DEFAULT", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.have.length(13);
                expect(response.body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
          it("responds with a 200 status code and retrieved comments, user choice of sorting", () => {
            return request(app)
              .get("/api/articles/5/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.have.length(2);
                expect(response.body.comments).to.be.sortedBy("votes", {
                  descending: false
                });
              });
          });
          it("ERROR 400 - correct path bad request", () => {
            return request(app)
              .get("/api/articles/not_an_id/comments")
              .send({ username: "robin", body: "hello there" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Bad Request");
              });
          });
        });
      });
    });
  });
});
