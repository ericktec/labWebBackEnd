const db = require("../../Services/db");
const mysql = require('mysql2/promise');
const config = require('../../Config/config');
const pool = mysql.createPool(config.db);

const controller = {
  test: async (req, res) => {
    const rows = await db.query("SELECT CURRENT_TIMESTAMP;");
    const response = res.json(rows[0]);
  },
  registerGame: async (req, res) => {
    const { tournamentPlayingCategoryId,
      firstRegistrationId,
      secondRegistrationId,
      round,
      winnerRegistrationId,
      numberOfSetsPlayed,
      isOpponentRetired,
      setsPlayer1,
      setsPlayer2
    } = req.body;
    console.log(req.body)
    const connection = await pool.getConnection();
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    await connection.beginTransaction();
    try {
      const fixtureInsertQuery = `INSERT INTO fixture (tournament_playing_category_id, first_registration_id,second_registration_id, round) 
      VALUES (?, ?, ?, ?)`;
      const [fixtureRows] = await connection.execute(fixtureInsertQuery, [tournamentPlayingCategoryId, firstRegistrationId, secondRegistrationId, round]);
      const fixtureId = fixtureRows.insertId
      const insertSetScore = `INSERT INTO set_score (fixture_id, set_number, first_registration_games, second_registration_games) VALUES(?,?,?,?)`;
      for (let i = 0; i < setsPlayer1.length; i++) {
        await connection.execute(insertSetScore, [fixtureId, i, setsPlayer1[i], setsPlayer2[i]]);
      }
      const insertFixtureResult = `INSERT INTO fixture_result (fixture_id, winner_registration_id, number_of_sets_played, is_opponent_retired) VALUES(?,?,?,?)`;
      await connection.execute(insertFixtureResult, [fixtureId, winnerRegistrationId, numberOfSetsPlayed, isOpponentRetired || null])
      await connection.commit();
      return res.json({ status: 'success' });
    } catch (error) {
      console.error(`Error occurred while creating tournament: ${error.message}`, error);
      await connection.rollback();
      console.info('Rollback successful');
      return res.json({ "status": "failed" });
    }
  }
}

module.exports = controller;