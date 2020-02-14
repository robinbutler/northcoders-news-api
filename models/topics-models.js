const query = require("../db/connection");

const fetchTopics = () => {
  return query
    .select("*")
    .from("topics")
    .orderBy("slug");
};

module.exports = fetchTopics;
