const knex = require("knex");
// const testConfig = require("../knexfile");
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

// const connection = knex(testConfig);

module.exports = knex(dbConfig);
