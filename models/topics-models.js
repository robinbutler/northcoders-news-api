const query = require("../db/connection");

const fetchTopics = () => {
  return query
    .select("*")
    .from("topics")
    .orderBy("slug")
    .then(topics => {
      return { topics };
    });
};

module.exports = fetchTopics;
