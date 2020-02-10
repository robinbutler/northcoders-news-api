const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("Format Dates", () => {
  it("returns an array with a different ref from input", () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
    expect(formatDates(input)).to.eql([]);
  });
  it("can change the time of a single object", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.an.instanceOf(Date);
  });
  it("can change the time of a multiple objects", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171
      }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.an.instanceOf(Date);
    expect(output[1].created_at).to.be.an.instanceOf(Date);
  });
});

describe("makeRefObj", () => {
  it("returns an array with a different ref from input", () => {
    const input = [];
    expect(makeRefObj(input)).to.not.equal(input);
    expect(makeRefObj(input)).to.eql({});
  });
  it("given a single object can create a single ref", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(input)).to.eql({
      "Living in the shadow of a great man": 1
    });
  });
  it("Can create a ref for multiple objects", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(input)).to.eql({
      "Living in the shadow of a great man": 1,
      "Living in the shadow of a great man": 2
    });
  });
});

describe("formatComments", () => {
  it("returns an array with a different ref from input", () => {
    const input = [];
    expect(formatComments(input)).to.not.equal(input);
    expect(formatComments(input)).to.eql([]);
  });
  it("single object with correct key value pairs", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      "Living in the shadow of a great man": 1
    };
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ]);
  });
  it("multiple objects with correct key value pairs", () => {
    const comments = [
      {
        body: "a",
        belongs_to: "a",
        created_by: "a",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "b",
        belongs_to: "b",
        created_by: "b",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      a: 1,
      b: 2
    };
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body: "a",
        article_id: 1,
        author: "a",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body: "b",
        article_id: 2,
        author: "b",
        votes: 14,
        created_at: 1479818163389
      }
    ]);
  });
});
