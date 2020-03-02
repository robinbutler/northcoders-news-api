process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
chai.use(chaiSorted);
chai.use(require("chai-json"));
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
  it("ERROR 405 INVALID METHOD, returns status 405 with msg  invalid method", () => {
    const invalidMethods = ["patch", "post", "delete"];
    const promiseArray = invalidMethods.map(method => {
      return request(app)
        [method]("/api/")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Invalid method");
        });
    });
    return Promise.all(promiseArray);
  });
  describe("GET", () => {
    it("200, returns correct status and json objects with all the endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(response => {
          expect(response).to.be.a.jsonObj();
        });
    });
  });
  describe("/topics", () => {
    it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
      const invalidMethods = ["patch", "delete"];
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
    describe.only("POST", () => {
      it("201 responds with posted topic", () => {
        return request(app)
          .post("/api/topics")
          .send({ description: "chess is cool", slug: "CHESS BOIS" })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).to.be.an("object");
            expect(topic).to.contain.keys("description", "slug");
          });
      });
      it("ERROR 400 for missing data - slug", () => {
        return request(app)
          .post("/api/topics")
          .send({ description: "chess is cool" })
          .expect(400);
      });
    });
  });
  describe("users", () => {
    describe("POST", () => {
      it("200 responds with correct status code list of all users");
    });
    describe("/:username", () => {
      it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
        const invalidMethods = ["delete", "post", "patch"];
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
        it("ERROR 404: responds with 404 and correct message on body", () => {
          return request(app)
            .get("/api/users/robin")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("User not found");
            });
        });
      });
    });
    describe("/articles", () => {
      it("status 200", () => {
        return request(app)
          .get("/api/users/butter_bridge/articles/")
          .expect(200);
      });
    });
    describe.only("/comments", () => {
      it("status 200", () => {
        return request(app)
          .get("/api/users/butter_bridge/comments/")
          .expect(200);
      });
    });
  });
  describe("/articles", () => {
    it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
      const invalidMethods = ["patch", "delete"];
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
      it("status 200, returns array of all articles with default sorting", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(12);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 200, returns array of all articles with author sorting", () => {
        return request(app)
          .get("/api/articles/?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(3);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 200, returns array of all articles with topic sorting", () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(11);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 200, returns empty array for correct topic with no articles", () => {
        return request(app)
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.eql([]);
          });
      });
      it("status 200, returns empty array for correct author with no articles", () => {
        return request(app)
          .get("/api/articles/?author=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.eql([]);
          });
      });
      it("status 200, returns array of all articles with default sorting when given incorrect query", () => {
        return request(app)
          .get("/api/articles/?cheese=black")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.have.length(12);
            expect(articles).to.be.sorted("created_at", { descending: true });
          });
      });
      it("status 400, when given sort_by of a non existent column", () => {
        return request(app)
          .get("/api/articles/?sort_by=cheese")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal("Bad Request");
          });
      });
    });
    describe("POST", () => {
      it("201 sucessful post responds with 201 and the posted article", () => {
        return request(app)
          .post("/api/articles")
          .send({
            title: "A new article",
            body: "Something to talk about",
            topic: "mitch",
            author: "icellusedkars"
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
          });
      });
      it("400 returns correct status when given invalid data - missing not nullable column", () => {
        return request(app)
          .post("/api/articles")
          .send({
            body: "Something to talk about",
            author: "icellusedkars"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request");
          });
      });
      it("422 returns correct status for unprocessable entity", () => {
        return request(app)
          .post("/api/articles")
          .send({
            title: "A new article",
            body: "Something to talk about",
            topic: "mitch",
            author: "not an author"
          })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Unprocessable input");
          });
      });
    });
    describe("/:id", () => {
      it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
        const invalidMethods = ["post"];
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
            .expect(200)
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
      describe("DELETE", () => {
        it("204 returns correct status and no body", () => {
          return request(app)
            .delete("/api/articles/1")
            .expect(204);
        });
        it("ERROR 400 returns 400 for invalid article id", () => {
          return request(app)
            .delete("/api/articles/dog")
            .expect(400);
        });
        it("ERROR 404 returns 404 for non existent article id", () => {
          return request(app)
            .delete("/api/articles/9000")
            .expect(404);
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
                expect(response.body.comment).to.contain.keys(
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
              .send({ username: "butter_bridge", body: "hello there" })
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 422 - correct path with non existent id", () => {
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
          it("responds with a 200 and [] for correct article with no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(response => {
                expect(response.body.comments).to.eql([]);
              });
          });
          it("ERROR 400 - correct path bad request", () => {
            return request(app)
              .get("/api/articles/not_an_id/comments")
              .expect(400)
              .then(response => {
                expect(response.body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 404 for non existent article", () => {
            return request(app)
              .get("/api/articles/999/comments")
              .expect(404)
              .then(response => {
                expect(response.body.msg).to.eql("Article not found");
              });
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("ERROR 405 INVALID METHOD, returns status 405 with msg invalid method", () => {
        const invalidMethods = ["get", "post"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid method");
            });
        });
        return Promise.all(promiseArray);
      });
      describe("PATCH", () => {
        it("status 201, returning updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(11);
              expect(comment).to.contain.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("ERROR 400 missing / incorrect data", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "bread" })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("ERROR 404 correct data for missing comment", () => {
          return request(app)
            .patch("/api/comments/100000")
            .send({ inc_votes: "5" })
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal("Comment not found");
            });
        });
      });
      describe("DELETE", () => {
        it("ERROR 204 returns correct status only", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("ERROR 404 if comment doesnt exist", () => {
          return request(app)
            .delete("/api/comments/11111111")
            .expect(404);
        });
      });
    });
  });
});
