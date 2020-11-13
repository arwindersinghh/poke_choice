const { Client } = require('pg');


const client = new Client('postgres://localhost/poke');

const syncAndSeed = async() => {
    const SQL = `
    DROP TABLE IF EXISTS TYPE;
    DROP TABLE IF EXISTS pokemon;
    CREATE TABLE pokemon(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100)
    );

    INSERT INTO pokemon(id, name) VALUES
    (1, 'Charmander'),
    (2, 'Squirtle'),
    (3, 'Bulbasaur');

    CREATE TABLE type(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        poke_id INTEGER REFERENCES pokemon(id)
    );

    INSERT INTO type(id, name, poke_id) VALUES
    (1, 'Fire', 1),
    (2, 'Water', 2),
    (3, 'Grass', 3);
  `;

  await client.query(SQL);
}



module.exports = {
    client,
    syncAndSeed
}