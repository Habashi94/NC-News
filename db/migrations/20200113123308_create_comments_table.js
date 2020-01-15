exports.up = function(knex) {
  return knex.schema.createTable("comments", function(comments_table) {
    comments_table.increments("comment_id").primary();
    comments_table
      .string("author")
      .references("users.username")
      .notNullable();
    comments_table
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    comments_table.integer("votes").defaultTo(0);
    comments_table.timestamp("created_at").defaultTo(knex.fn.now());
    comments_table.text("body").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
