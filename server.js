const {client, syncAndSeed } = require('./db');
const express = require('express');
const path = require('path')


const app = express();

const port = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', async(req, res, next) => {
    try{
        const data = await client.query('SELECT * FROM pokemon;');
        const manyPokemon = data.rows;
        res.send(`
        <html>
        <head>
        <link rel='stylesheet' href='/assets/styles.css' />
        <title>POKEMON ^o^</title>
        </head>
        <body>
        <h1>POKEMON WORLD ! ! !</h1>
        <h2>Pokemon</h2>
        <ul>
        ${
            manyPokemon.map(pokemon => `
            <li>
            <a href='/pokemon/${pokemon.id}'>
            ${pokemon.name}
            </li>
            `).join('') 
        }
        </ul>
        </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
})

app.get('/pokemon/:id', async(req, res, next) => {
    try{
        const promises = [client.query('SELECT * FROM pokemon WHERE id=$1;', [req.params.id]),
                        client.query('SELECT * FROM type WHERE poke_id=$1;', [req.params.id])];
        const [pokemonResponse, typeResponse] =  await Promise.all(promises);
        const onePokemon = pokemonResponse.rows[0];
        const types = typeResponse.rows;
        res.send(`
        <html>
        <head>
        <link rel='stylesheet' href='/assets/styles.css' />
        <title>POKEMON ^o^</title>
        </head>
        <body>
        <h1>POKEMON WORLD ! ! !</h1>
        <h2><a href='/'>Pokemon</a></h2>
        <h3>You chose ${onePokemon.name} !!!</h3>
        <ul>
            ${
                types.map(type => `
                    <li>
                    ${type.name}
                    </li>
                `).join('')
            }
        </ul>
        </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
})
    

const start = async() => {
    try{
        await client.connect();
        await syncAndSeed();
        console.log('We are connected');
        app.listen(port, ()=>{
            console.log(`You are being heard on port ${port}`)
        })
    }
    catch(ex){
        console.log(ex);
    }
}

start();



