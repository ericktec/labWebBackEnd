const db = require("../../Services/db");

const controller = {
  test: async (req, res) => {
    const rows = await db.query("SELECT CURRENT_TIMESTAMP;");
    const response = res.json(rows[0]);
  }
}

module.exports = controller;