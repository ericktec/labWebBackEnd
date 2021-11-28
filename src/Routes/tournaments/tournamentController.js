const db = require("../../Services/db");
const mysql = require('mysql2/promise');
const config = require('../../Config/config');

const controller = {
  getTournaments: async (req, res) => {
    const query = `SELECT tournament_playing_category.id as tournament_playing_category_id, tournament_name, location, start_date, end_date, number_of_rounds, tournament_photo, category_name, tournament_type, surface_type FROM 
    tournament JOIN tournament_playing_category
    ON tournament.id = tournament_playing_category.tournament_id
    JOIN playing_category ON playing_category.id = tournament_playing_category.playing_category_id
    JOIN tournament_type ON tournament.tournament_type_id = tournament_type.id
    JOIN surface_type ON tournament.surface_type_id = surface_type.id
    ORDER BY tournament_playing_category.id;`
    const rows = await db.query(query);
    res.json({ "status": "success", tournaments: rows });
  },
  createTournament: async (req, res) => {
    const connection = await db.pool.getConnection();
    const { tournamentName, location, startDate, endDate, numberOfRounds, tournamentTypeId, surfaceTypeId, playingCategoryId, tournamentPhoto } = req.body;
    console.log(tournamentName)
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
      res.json({ status: "success", tournamentCategoryId: tournamentCategoryRows.insertId });

    } catch (error) {
      console.error(`Error occurred while creating tournament: ${error.message}`, error);
      await connection.rollback();
      await connection.release();
      console.info('Rollback successful');
      return res.json({ "status": "failed" });
    }
  },
  registerPlayer: async (req, res) => {
    console.log('Test');
    const { playerId, tournamentPlayingCategoryId, seed } = req.body;
    const connection = await db.pool.getConnection();
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    console.log('Finished setting the isolation level to read committed');
    await connection.beginTransaction();
    try {

      const RegistrationQuery = `INSERT INTO registration (registration_date) VALUES (?)`;
      const [registrationRows] = await connection.execute(RegistrationQuery, [new Date()]);
      console.log(registrationRows);
      const registrationId = registrationRows.insertId
      const registrationPlayerQuery = `INSERT INTO registration_player (registration_id, player_id) VALUES(?, ?)`;
      const [registrationPlayer] = await connection.execute(registrationPlayerQuery, [registrationId, playerId]);
      const playingInQuery = `INSERT INTO playing_in (registration_id, seed, tournament_playing_category_id) VALUES (?,?,?)`;
      const [playingInRows] = await connection.execute(playingInQuery, [registrationId, seed, tournamentPlayingCategoryId]);
      console.log("New registration with id", playingInRows.insertId);

      await connection.commit();
      await connection.release();
      res.json({ status: "success", playerRegistrationId: playingInRows.insertId });

    } catch (error) {
      console.error(`Error occurred while creating tournament: ${error.message}`, error);
      await connection.rollback();
      await connection.release();
      console.info('Rollback successful');
      return res.json({ "status": "failed" });
    }

  },
  getPlayers: async (req, res) => {
    const { tournamentCategoryId } = req.params;
    const query = `
    SELECT player.first_name, player.last_name, player.photo_url, playing_in.seed, playing_in.tournament_playing_category_id, playing_in.registration_id
    FROM playing_in
    JOIN registration
    ON playing_in.registration_id = registration.id
    JOIN registration_player
    ON registration.id = registration_player.registration_id
    JOIN player
    ON player.id = registration_player.player_id
    WHERE playing_in.tournament_playing_category_id = ?;`
    const rows = await db.query(query, [tournamentCategoryId]);
    return res.json({
      status: "success",
      players: rows
    });
  }
}

module.exports = controller;