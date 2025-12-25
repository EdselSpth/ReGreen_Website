const { promisify } = require("util");
const db = require("../config/db");

// db.query callback -> jadi Promise
const query = promisify(db.query).bind(db);

module.exports = { query };
