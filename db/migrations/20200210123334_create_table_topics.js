exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("description").notNullable();
    topicsTable.string("slug").primary();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
