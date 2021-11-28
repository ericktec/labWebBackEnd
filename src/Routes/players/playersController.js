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
  },
  getPlayersUnregistered: async (req, res) => {
    const {tournamentCategoryId} = req.params;
    const query = `SELECT *
    FROM player
    WHERE player.id NOT IN
    (
      SELECT player.id
      FROM registration_player
      JOIN registration ON registration.id = registration_player.registration_id
      JOIN playing_in ON registration.id = playing_in.registration_id
      JOIN player ON player.id = registration_player.player_id
      WHERE playing_in.tournament_playing_category_id = ?
    );`;
    const rows = await db.query(query, [tournamentCategoryId]);
    return res.json({ "status": "success", players: rows })
  }
}

module.exports = controller;