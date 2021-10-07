-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2021-10-07 20:03:56.407

-- tables
-- Table: Admins
CREATE TABLE Admins (
    id integer NOT NULL AUTO_INCREMENT,
    email varchar(100) NULL,
    name varchar(100) NULL,
    password varchar(100) NULL,
    CONSTRAINT Admins_pk PRIMARY KEY (id)
);

-- Table: country
CREATE TABLE country (
    code char(3) NOT NULL,
    country_name varchar(250) NOT NULL,
    CONSTRAINT country_pk PRIMARY KEY (code)
);

-- Table: fixture
CREATE TABLE fixture (
    id integer NOT NULL AUTO_INCREMENT,
    tournament_playing_category_id integer NOT NULL,
    first_registration_id integer NOT NULL,
    second_registration_id integer NOT NULL,
    round integer NOT NULL,
    CONSTRAINT fixture_pk PRIMARY KEY (id)
);

-- Table: fixture_result
CREATE TABLE fixture_result (
    fixture_id integer NOT NULL AUTO_INCREMENT,
    winner_registration_id integer NOT NULL,
    number_of_sets_played integer NOT NULL,
    is_opponent_retired char(1) NULL,
    CONSTRAINT fixture_result_pk PRIMARY KEY (fixture_id)
);

-- Table: game_score
CREATE TABLE game_score (
    fixture_id integer NOT NULL ,
    set_number integer NOT NULL,
    game_number integer NOT NULL,
    first_registration_point integer NOT NULL,
    second_registration_point integer NOT NULL,
    CONSTRAINT game_score_pk PRIMARY KEY (fixture_id,set_number,game_number)
);

-- Table: player
CREATE TABLE player (
    id integer NOT NULL AUTO_INCREMENT,
    first_name varchar(50) NULL,
    last_name varchar(50) NULL,
    gender char(1) NULL,
    date_of_birth date NULL,
    country_code char(3) NOT NULL,
    photo_url varchar(250) NULL,
    CONSTRAINT player_pk PRIMARY KEY (id)
);

-- Table: playing_category
CREATE TABLE playing_category (
    id integer NOT NULL AUTO_INCREMENT,
    category_name varchar(50) NOT NULL,
    CONSTRAINT playing_category_pk PRIMARY KEY (id)
);

-- Table: playing_in
CREATE TABLE playing_in (
    id integer NOT NULL AUTO_INCREMENT,
    registration_id integer NOT NULL,
    seed integer NOT NULL,
    tournament_playing_category_id integer NOT NULL,
    CONSTRAINT playing_in_pk PRIMARY KEY (id)
);

-- Table: registration
CREATE TABLE registration (
    id integer NOT NULL AUTO_INCREMENT,
    registration_date date NOT NULL,
    CONSTRAINT registration_pk PRIMARY KEY (id)
);

-- Table: registration_player
CREATE TABLE registration_player (
    registration_id integer NOT NULL,
    player_id integer NOT NULL,
    CONSTRAINT registration_player_pk PRIMARY KEY (registration_id,player_id)
);

-- Table: set_score
CREATE TABLE set_score (
    fixture_id integer NOT NULL,
    set_number integer NOT NULL,
    first_registration_games integer NOT NULL,
    second_registration_games integer NOT NULL,
    CONSTRAINT set_score_pk PRIMARY KEY (fixture_id,set_number)
);

-- Table: surface_type
CREATE TABLE surface_type (
    id integer NOT NULL AUTO_INCREMENT,
    surface_type varchar(50) NOT NULL,
    CONSTRAINT surface_type_pk PRIMARY KEY (id)
);

-- Table: tie_breaker
CREATE TABLE tie_breaker (
    fixture_id integer NOT NULL,
    set_number integer NOT NULL,
    first_registration_tie_breaker integer NOT NULL,
    sec_registration_tie_breaker integer NOT NULL,
    CONSTRAINT tie_breaker_pk PRIMARY KEY (fixture_id,set_number)
);

-- Table: tournament
CREATE TABLE tournament (
    id integer NOT NULL AUTO_INCREMENT,
    tournament_name varchar(100) NOT NULL,
    location varchar(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    number_of_rounds integer NOT NULL,
    tournament_type_id integer NOT NULL,
    surface_type_id integer NOT NULL,
    tournament_photo varchar(250) NULL,
    CONSTRAINT tournament_pk PRIMARY KEY (id)
);

-- Table: tournament_playing_category
CREATE TABLE tournament_playing_category (
    id integer NOT NULL AUTO_INCREMENT,
    tournament_id integer NOT NULL,
    playing_category_id integer NOT NULL,
    CONSTRAINT tournament_playing_category_pk PRIMARY KEY (id)
);

-- Table: tournament_type
CREATE TABLE tournament_type (
    id integer NOT NULL AUTO_INCREMENT,
    tournament_type varchar(30) NOT NULL,
    CONSTRAINT tournament_type_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: Tie_breaker_fixture (table: tie_breaker)
ALTER TABLE tie_breaker ADD CONSTRAINT Tie_breaker_fixture FOREIGN KEY Tie_breaker_fixture (fixture_id)
    REFERENCES fixture (id);

-- Reference: fixture_registration_1 (table: fixture)
ALTER TABLE fixture ADD CONSTRAINT fixture_registration_1 FOREIGN KEY fixture_registration_1 (first_registration_id)
    REFERENCES registration (id);

-- Reference: fixture_registration_2 (table: fixture)
ALTER TABLE fixture ADD CONSTRAINT fixture_registration_2 FOREIGN KEY fixture_registration_2 (second_registration_id)
    REFERENCES registration (id);

-- Reference: fixture_result_fixture (table: fixture_result)
ALTER TABLE fixture_result ADD CONSTRAINT fixture_result_fixture FOREIGN KEY fixture_result_fixture (fixture_id)
    REFERENCES fixture (id);

-- Reference: fixture_result_registration (table: fixture_result)
ALTER TABLE fixture_result ADD CONSTRAINT fixture_result_registration FOREIGN KEY fixture_result_registration (winner_registration_id)
    REFERENCES registration (id);

-- Reference: fixture_tour_playing_cat (table: fixture)
ALTER TABLE fixture ADD CONSTRAINT fixture_tour_playing_cat FOREIGN KEY fixture_tour_playing_cat (tournament_playing_category_id)
    REFERENCES tournament_playing_category (id);

-- Reference: game_score_fixture (table: game_score)
ALTER TABLE game_score ADD CONSTRAINT game_score_fixture FOREIGN KEY game_score_fixture (fixture_id)
    REFERENCES fixture (id);

-- Reference: played_in_tour_playing_cat (table: playing_in)
ALTER TABLE playing_in ADD CONSTRAINT played_in_tour_playing_cat FOREIGN KEY played_in_tour_playing_cat (tournament_playing_category_id)
    REFERENCES tournament_playing_category (id);

-- Reference: player_country (table: player)
ALTER TABLE player ADD CONSTRAINT player_country FOREIGN KEY player_country (country_code)
    REFERENCES country (code);

-- Reference: playing_in_registration (table: playing_in)
ALTER TABLE playing_in ADD CONSTRAINT playing_in_registration FOREIGN KEY playing_in_registration (registration_id)
    REFERENCES registration (id);

-- Reference: registration_player_player (table: registration_player)
ALTER TABLE registration_player ADD CONSTRAINT registration_player_player FOREIGN KEY registration_player_player (player_id)
    REFERENCES player (id);

-- Reference: registration_player_reg (table: registration_player)
ALTER TABLE registration_player ADD CONSTRAINT registration_player_reg FOREIGN KEY registration_player_reg (registration_id)
    REFERENCES registration (id);

-- Reference: set_score_fixture (table: set_score)
ALTER TABLE set_score ADD CONSTRAINT set_score_fixture FOREIGN KEY set_score_fixture (fixture_id)
    REFERENCES fixture (id);

-- Reference: tour_playing_cat_playing_cat (table: tournament_playing_category)
ALTER TABLE tournament_playing_category ADD CONSTRAINT tour_playing_cat_playing_cat FOREIGN KEY tour_playing_cat_playing_cat (playing_category_id)
    REFERENCES playing_category (id);

-- Reference: tour_playing_cat_tour (table: tournament_playing_category)
ALTER TABLE tournament_playing_category ADD CONSTRAINT tour_playing_cat_tour FOREIGN KEY tour_playing_cat_tour (tournament_id)
    REFERENCES tournament (id);

-- Reference: tournament_surface_type (table: tournament)
ALTER TABLE tournament ADD CONSTRAINT tournament_surface_type FOREIGN KEY tournament_surface_type (surface_type_id)
    REFERENCES surface_type (id);

-- Reference: tournament_tournament_type (table: tournament)
ALTER TABLE tournament ADD CONSTRAINT tournament_tournament_type FOREIGN KEY tournament_tournament_type (tournament_type_id)
    REFERENCES tournament_type (id);

-- End of file.

