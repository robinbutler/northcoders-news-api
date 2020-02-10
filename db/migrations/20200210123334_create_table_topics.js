exports.up = function(knex) {
  knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  knex.schema.dropTable("topics");
};
