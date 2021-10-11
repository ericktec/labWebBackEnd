const db = require("../../Services/db");
const mysql = require('mysql2/promise');
const config = require('../../Config/config');
const pool = mysql.createPool(config.db);

const controller = {
  getTournaments: async (req, res) => {
    res.json({ "status": "success" });
  },
  createTournament: async (req, res) => {
    const connection = await pool.getConnection();
    const { tournamentName, location, startDate, endDate, numberOfRounds, tournamentTypeId, surfaceTypeId, playingCategoryId, tournamentPhoto } = req.body;
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    await connection.beginTransaction();
    try {
      const InsertTournamentQuery = `INSERT INTO tournament (tournament_name, location, start_date, end_date, number_of_rounds, tournament_type_id,
      surface_type_id,
      tournament_photo)
      VALUES (?,?,?,?,?,?,?,?)`;

      const [tournamentRows, TournamentFields] = await connection.execute(InsertTournamentQuery, [tournamentName, location, new Date(startDate), new Date(endDate), numberOfRounds, tournamentTypeId, surfaceTypeId, tournamentPhoto]);

      const tournamentId = tournamentRows.insertId;
      console.log("New tournament inserted with id " + tournamentId);

      const queryCategory = `INSERT INTO tournament_playing_category (tournament_id, playing_category_id) VALUES(?,?)`;
      const [tournamentCategoryRows] = await connection.execute(queryCategory, [tournamentId, playingCategoryId]);

      console.log("Created new category for tournament " + tournamentId + " with new id " + tournamentCategoryRows.insertId);
      await connection.commit();
      res.json({ status: "successful", tournamentCategoryId: tournamentCategoryRows.insertId });

    } catch (error) {
      console.error(`Error occurred while creating tournament: ${error.message}`, error);
      await connection.rollback;
      console.info('Rollback successful');
      return res.json({ "status": "failed" });
    }
  }
}

module.exports = controller;