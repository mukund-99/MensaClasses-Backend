const mysql = require("mysql2");
const util = require("util");

const conn = mysql.createConnection({
  host: "by4aovvgdchd7azulkuc-mysql.services.clever-cloud.com",
  user: "u2rwlwlrnujaqo1t",
  password: "4HaVmmc7maI8VgVSCBte",
  database: "by4aovvgdchd7azulkuc"
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});
const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
