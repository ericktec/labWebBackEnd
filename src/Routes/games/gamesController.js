const db = require("../../Services/db");
const mysql = require('mysql2/promise');
const config = require('../../Config/config');

const controller = {
  getGamesByTournamentCategoryId: async (req, res) => {
    console.log(req.params)
    const { tournamentCategoryId } = req.params;
    const query = `SELECT *
    FROM fixture
    JOIN fixture_result
    ON fixture.id = fixture_result.fixture_id
    WHERE fixture.tournament_playing_category_id = ?;`;
    const rows = await db.query(query, [tournamentCategoryId]);
    if (rows.length === 0) return res.json({ status: 'error', message: "No games" });
    for (let i = 0; i < rows.length; i++) {
      const gamesDetails = rows[i];
      const getSetScoresQuery = `
      SELECT set_number, first_registration_games, second_registration_games 
      FROM set_score
      WHERE fixture_id = ?;`;
      const setScores = await db.query(getSetScoresQuery, [gamesDetails.id]);
      gamesDetails.sets = setScores;
      const getPlayerName = `SELECT player.first_name, player.last_name, player.photo_url
      FROM registration
      JOIN registration_player
      ON registration.id = registration_player.registration_id
      JOIN player
      ON registration_player.player_id = player.id
      WHERE registration.id = ?;`;
      const playerOneName = await db.query(getPlayerName, [gamesDetails.first_registration_id]);
      const playerTwoName = await db.query(getPlayerName, [gamesDetails.second_registration_id]);
      if (!playerOneName || !playerTwoName) return res.json({ status: 'error' });
      gamesDetails.player_one_details = { ...playerOneName[0] };
      gamesDetails.player_two_details = { ...playerTwoName[0] };
    }
    res.json({ status: "success", gamesDetails: rows });
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
    const connection = await db.pool.getConnection();
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
      await connection.release();
      return res.json({ status: 'success' });
    } catch (error) {
      console.error(`Error occurred while creating tournament: ${error.message}`, error);
      await connection.rollback();
      await connection.release();
      console.info('Rollback successful');
      return res.json({ "status": "failed" });
    }
  }
}

module.exports = controller;