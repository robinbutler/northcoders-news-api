exports.up = function(knex) {
  knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primery();
    commentsTable
      .string("author")
      .references("username")
      .inTable("users");
    commentsTable
      .int("article_id")
      .references("article_id")
      .inTable("articles");
    commentsTable.int("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    articleTable
      .body("body")
      .notNullable()
      .defaultTo("Content Here");
  });
};

exports.down = function(knex) {
  knex.schema.dropTable("comments");
};
