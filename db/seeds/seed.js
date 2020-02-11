const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);

      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          return knex("articles")
            .insert(formatDates(articleData))
            .returning("*");
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);
          let dateFormattedComments = formatDates(commentData);

          const formattedComments = formatComments(
            dateFormattedComments,
            articleRef
          );
          return knex("comments").insert(formattedComments);
        });
    });
};
