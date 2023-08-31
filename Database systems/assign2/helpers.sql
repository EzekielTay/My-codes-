-- COMP3311 23T1 Ass2 ... SQL helper Views/Functions
-- Add any views or functions you need into this file
-- Note: it must load without error into a freshly created Movies database
-- Note: you must submit this file even if you add nothing to it

-- The `dbpop()` function is provided for you in the dump file
-- This is provided in case you accidentally delete it

DROP TYPE IF EXISTS Population_Record CASCADE;
CREATE TYPE Population_Record AS (
	Tablename Text,
	Ntuples   Integer
);

CREATE OR REPLACE FUNCTION DBpop() RETURNS SETOF Population_Record
AS $$
DECLARE
    rec Record;
    qry Text;
    res Population_Record;
    num Integer;
BEGIN
    FOR rec IN SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename LOOP
        qry := 'SELECT count(*) FROM ' || quote_ident(rec.tablename);

        execute qry INTO num;

        res.tablename := rec.tablename;
        res.ntuples   := num;

        RETURN NEXT res;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

--
-- Example Views/Functions
-- These Views/Functions may or may not be useful to you.
-- You may modify or delete them as you see fit.
--

-- `Move_Learning_Info`
-- The `Learnable_Moves` table is a relation between Pokemon, Moves, Games and Requirements.
-- As it just consists of foreign keys, it is not very easy to read.
-- This view makes it easier to read by displaying the names of the Pokemon, Moves and Games instead of their IDs.
CREATE OR REPLACE VIEW Move_Learning_Info(Pokemon, Move, Game, Requirement) AS
SELECT
    P.Name,
    M.Name,
    G.Name,
    R.Assertion
FROM
    Learnable_Moves AS L
    JOIN
    Pokemon         AS P ON Learnt_By   = P.ID
    JOIN
    Games           AS G ON Learnt_In   = G.ID
    JOIN
    Moves           AS M ON Learns      = M.ID
    JOIN
    Requirements    AS R ON Learnt_When = R.ID
;

-- `Super_Effective`
-- This function takes a type name and
-- returns a set of all types that it is super effective against (multiplier > 100)
-- eg Water is super effective against Fire, so `Super_Effective('Water')` will return `Fire` (amongst others)
CREATE OR REPLACE FUNCTION Super_Effective(_Type Text) RETURNS SETOF Text
AS $$
SELECT
    B.Name
FROM
    Types              AS A
    JOIN
    Type_Effectiveness AS E ON A.ID = E.Attacking
    JOIN
    Types              AS B ON B.ID = E.Defending
WHERE
    A.Name = _Type
    AND
    E.Multiplier > 100
$$ LANGUAGE SQL;

--
-- Your Views/Functions Below Here
-- Remember This file must load into a clean Pokemon database in one pass without any error
-- NOTICEs are fine, but ERRORs are not
-- Views/Functions must be defined in the correct order (dependencies first)
-- eg if my_supper_clever_function() depends on my_other_function() then my_other_function() must be defined first
-- Your Views/Functions Below Here
--

-- pokemon_exist_in_game
-- Returns a table of pokemons along with the game they exist in
-- drop view pokemon_exist_in_game;
Create or REPLACE view pokemon_exist_in_game(g_name, p_region_id, p_id, p_name, p_species, p_type1, p_type2)
as
SELECT Games.Name, Pokedex.Regional_ID, Pokemon.ID, Pokemon.name, Pokemon.species, Types.name, (SELECT name from Types WHERE Types.ID = Pokemon.Second_Type limit 1)
FROM Games
    JOIN Pokedex on (Games.ID = Pokedex.Game)
    JOIN Pokemon on (Pokedex.National_ID = Pokemon.ID)
    JOIN Types on (Pokemon.First_Type = Types.ID);



-- pokemon_learnable_moves 
-- returns a table of moves that a pokemon can learn by leveling up ordered by moves.ID
-- drop view pokemon_learnable_moves;
Create or REPLACE view pokemon_learnable_moves(g_name, p_name, m_id, m_name, m_requirement)
as
SELECT G.name, P.name, M.ID, M.name, L.Learnt_When
from Pokemon P
    JOIN Learnable_Moves L on (P.ID = L.Learnt_By)
    JOIN Moves M on (L.Learns = M.ID)
    JOIN Games G on (L.Learnt_In = G.ID)
WHERE L.Learnt_When between 1 and 100
order by M.ID;

-- move_details
-- Returns all information on a move.
-- drop view move_details;
Create or REPLACE view move_details (m_id, m_name, m_effect, m_of_type, m_category, m_power, m_accuracy, m_bpp)
as
select m.ID, m.Name, m.Effect, t.Name, m.Category, m.POWER, m.accuracy, m.Base_Power_Points
from Moves m
    JOIN Types t on (m.Of_Type = t.ID);

-- possible_evolutions
-- Returns all possible evolutions and their details
-- drop view possible_evolutions;
Create or REPLACE view possible_evolutions (ev_from, ev_to, ev_id, ev_requirement, r_id, ev_inverted)
as
select (select name from pokemon where ID = e.pre_evolution), p.name, e.ID, r.Assertion, r.ID, v.Inverted
from Evolutions e
    JOIN Pokemon p on (E.Post_evolution = p.ID)
    JOIN Evolution_Requirements v on (e.ID = v.Evolution)
    JOIN Requirements r on (v.Requirement = r.ID)
order by e.ID, v.Inverted, r.ID;

-- density_data 
-- Return all pokemons that appear in a particular location
-- drop view density_data;
Create or REPLACE view density_data (g_region, g_id, l_name, p_height, p_weight, p_rarity)
as
select g.Region, g.ID, l.Name, p.Average_Height, p.Average_Weight, e.Rarity
from Games g
    JOIN Locations l on (g.ID = l.Appears_In)
    JOIN Encounters e on (l.ID = e.Occurs_At)
    Join Pokemon p on (e.Occurs_With = p.ID)
order by l.Name;


-- Pokemon_encounter
-- Retunrs all pokemon that can be encountered in a particular location and game.
-- drop view pokemon_encounter;
Create or replace view pokemon_encounter(g_name, l_name, p_name, p_rarity, p_levels, e_ID, e_requirements, e_inverted)
as
select g.Name, l.Name, p.Name, e.Rarity, e.Levels, e.ID, r.Assertion, c.Inverted
from Games g 
    Join Locations l on (g.ID = l.Appears_In)
    Join Encounters e on (l.ID = e.Occurs_At)
    Join Encounter_Requirements c on (e.ID = c.Encounter)
    Join Requirements r on (c.Requirement = r.ID)
    Join Pokemon p on (e.Occurs_With = p.ID);

-- pokemon_data
-- Returns data on a pokemon which is more readable
-- drop view pokemon_egg_group;
create or replace view pokemon_egg_group (g_name, l_name, p_name, p_first_type, p_second_type, p_group)
as
select g.name, l.name, p.name, t.name, (select name from types where ID = p.Second_Type), o.Name
from Games g
    JOIN Locations l on (g.ID = l.Appears_In)
    JOIN Encounters e on (l.ID = e.Occurs_At)
    Join Pokemon p on (e.Occurs_With = p.ID)
    Join Types t on (p.First_Type = t.ID)
    Join In_Group i on (p.ID = i.Pokemon)
    Join Egg_Groups o on (i.Egg_Group = o.ID);

-- pokemon_abilities
-- Returns a table of the knowable abilities of a pokemon ordered by Abilities.ID
-- drop view pokemon_abilities;
Create or REPLACE view pokemon_abilities(g_name, l_name, p_name, p_ability_id, p_abilities, p_hidden, p_effect)
as
SELECT g.name, l.name, P.name, A.id, A.name, K.Hidden, A.effect
from Games g
    JOIN Locations l on (g.ID = l.Appears_In)
    JOIN Encounters e on (l.ID = e.Occurs_At)
    Join Pokemon p on (e.Occurs_With = p.ID)
    JOIN Knowable_Abilities K on (P.ID = K.Known_By)
    JOIN Abilities A on (K.Knows = A.ID)
order by A.ID;


-- q5_pokemon_in_game
-- Find all pokemon that exist in the given game name
-- drop view q5_pokemon_in_game;
Create or REPLACE view q5_pokemon_in_game(g_name, p_name, p_first_type, p_second_type, p_base_stats, p_move)
as
select g.name, p.name, p.first_type, p.Second_Type, p.Base_Stats, l.Learns
from Games g 
    Join Learnable_Moves l on (g.ID = l.Learnt_In)
    Join Pokemon p on (l.Learnt_By = p.ID);


-- q5_pokemon_moves
-- Find all unique physical and special attacks that a pokemon can make 
-- drop view q5_pokemon_moves;
Create or REPLACE view q5_pokemon_moves(g_name, p_name, m_id, m_name, m_type, m_category, m_power)
as
select g.name, p.name, m.id, m.name, m.Of_Type, m.Category, m.POWER
from Pokemon p
    join Learnable_Moves l on (p.id = l.Learnt_By)
    join Moves m on (m.id = l.Learns)
    join Games g on (l.Learnt_In = g.ID)
where m.POWER is not NULL
group by g.name, p.name, m.id, m.name, m.Of_Type, m.Category, m.POWER;

