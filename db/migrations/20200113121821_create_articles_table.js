exports.up = function(knex) {
  return knex.schema.createTable("articles", function(articles_table) {
    articles_table.increments("article_id").primary();
    articles_table.string("title");
    articles_table.text("body");
    articles_table.integer("votes").defaultTo(0);
    articles_table.string("topic").references("topics.slug");
    articles_table.string("author").references("users.username");
    articles_table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
