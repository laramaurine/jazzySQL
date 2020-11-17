const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const pg = require('pg');
// static content. this will be replaced with a database table
// const songListArray = [
//     {
//         title: 'Take Five',
//         length: '2:55',
//         date_released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         date_released: '1959-08-17'
//     }
// ];

const pool = new Pool({
    database : 'jazzy_ajax',
    port: 5432,
    host: 'localhost'

});

pool.on('connect', () => {
    console.log(`connected to database...`);
})

pool.on('error', (error) => {
    console.log('error from pg', error);
})


router.get('/', (req, res) => {
    console.log(`In /songs GET`);
    let sqlText = `SELECT * FROM songs ORDER BY title`;
    pool.query(sqlText)
        .then( (result) => {
            console.log('got backk', result.rows);
            res.send(result.rows)
        })
        .catch( (error) => {
            console.log('error from db', error);
            res.sendStatus(500);
        })
    
    //res.send(songListArray);
});

router.post('/', (req, res) => {
    let song = req.body;
    let sqlText = `INSERT INTO "songs"("title", "length", "date_released")
                VALUES($1, $2, $3);`
    pool.query(sqlText, [song.title, song.length, song.date_released])
        .then( (response) => {
            res.sendStatus(201);
        })
        .catch( (error) => {
            console.log('error from db', error);
            res.sendStatus(500);
        })
    
    //res.sendStatus(201);
});

module.exports = router;