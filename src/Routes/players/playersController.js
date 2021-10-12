const db = require("../../Services/db");

const controller = {
  newPlayer: async (req, res) => {
    const { firstName, lastName, gender, dateOfBirth, countryCode, photoUrl } = req.body;
    const rows = await db.query(`INSERT INTO 
    player (first_name, last_name, gender, date_of_birth, country_code, photo_url) 
    VALUES (?, ?, ?, ?, ?, ?)`, [firstName, lastName, gender, new Date(dateOfBirth), countryCode ? countryCode : null, photoUrl]);
    console.log(rows);
    return res.json({ "status": "success", "message": "New player registered" });
  },
  getPlayers: async (req, res) => {
    const query = `SELECT * FROM player`;
    const rows = await db.query(query);
    return res.json({ "status": "success", players: rows });
  }
}

module.exports = controller;