--Get all players with the tournament details and player details
SELECT *
FROM playing_in
JOIN registration
ON playing_in.registration_id = registration.id
JOIN registration_player
ON registration.id = registration_player.registration_id
JOIN player
ON player.id = registration_player.player_id
JOIN tournament_playing_category
ON playing_in.tournament_playing_category_id = tournament_playing_category.id
JOIN tournament
ON tournament_playing_category.tournament_id = tournament.id;

--Get all players with their corresponding tournament category id
SELECT player.first_name, player.last_name, player.photo_url, playing_in.seed, playing_in.tournament_playing_category_id
FROM playing_in
JOIN registration
ON playing_in.registration_id = registration.id
JOIN registration_player
ON registration.id = registration_player.registration_id
JOIN player
ON player.id = registration_player.player_id;
