exports.up = function(knex) {
  return knex.schema.createTable("users", function(users_table) {
    users_table
      .string("username")
      .primary()
      .unique()
      .notNullable();
    users_table.string("avatar_url");
    users_table.string("name");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
