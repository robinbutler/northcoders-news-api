exports.up = function(knex) {
  knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name");
  });
};

exports.down = function(knex) {
  knex.schema.dropTable("users");
};
