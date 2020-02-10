exports.up = function(knex) {
  knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable
      .string("title")
      .notNullable()
      .defaultTo("Title Pending");
    articleTable
      .body("body")
      .notNullable()
      .defaultTo("Content Here");
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .references("slug")
      .inTable("topics");
    articleTable
      .string("author")
      .references("username")
      .inTable("users");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  knex.schema.dropTable("articles");
};
