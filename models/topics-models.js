const query = require("../db/connection");

const fetchTopics = () => {
  return query
    .select("*")
    .from("topics")
    .orderBy("slug");
};

const addTopic = topic => {
  return query("topics")
    .insert(topic)
    .returning("*")
    .then(topic => {
      return topic[0];
    });
};

module.exports = { fetchTopics, addTopic };
