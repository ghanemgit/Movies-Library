'use strict'


////////Called Library/////////
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
////////Called Library/////////


///////Appling library at our server/////////
const server = express();
server.use(cors());
server.use(express.json());
///////Appling library at our server/////////


//////From .env///////
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const KEY = process.env.KEY;
//////From .env///////

const client = new pg.Client(DATABASE_URL);

///////////Task12/////////////
server.get('/', homePage);
server.get('/trending', trending);
server.get('/search', search);
///////////Task12/////////////

///////////Task13/////////////
server.post('/addMovie', addMovie);//insert in the database
server.get('/getMovies', getMovie);//get all movie form added movie list
///////////Task13/////////////


///////////Task14/////////////
server.put('/UPDATE/:id', IdUpdate);//update specific move from database
server.delete('/DELETE/:id', IdDelete);//Delete specific move from database
server.get('/getMovie/:id', Idsearch);//get specific move from database
///////////Task14/////////////


//////////Error Handler//////////
server.use('*', catchNotFoundError);
server.use(errorCatch);
//////////Error Handler//////////


///////Main Constructor////////
function MovieInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


//let user_language_search = "en-US";
//let userSearch = "Jack Reacher";//i create function to replace space by plus sign below {replaceSpaceByPlus(string)}
let user_media_type = "all";
let user_time_window = "week";
let trendingUrl = `https://api.themoviedb.org/3/trending/${user_media_type}/${user_time_window}?api_key=${KEY}&language=en-us`;



/////////////////////////////////////////****Task 12****/////////////////////////////////////////////
function homePage(req, res) {

    res.status(200).send("Welcome to our page :)")

}

function trending(req, res) {

    let arr = [];
    axios.get(trendingUrl)
        .then((resultComeFromAPI) => {
            arr = resultComeFromAPI.data.results.map(info => {
                return new MovieInfo(info.id, info.title, info.release_date, info.poster_path, info.overview);
            });
            res.status(200).json(arr);
        }).catch((error) => {
            errorCatch(error, req, res);
        })

}
function search(req, res) {
    let userSearch = req.query.userSearch;//EX Jack Reacher
    let user_language_search = req.query.user_language_search;//EX en-US
    let arr2 = [];
    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=${user_language_search}&query=${userSearch}`;
    axios.get(searchUrl).then((resultComeFromAPI) => {
        arr2 = resultComeFromAPI.data.results.map(info => {
            return new MovieInfo(info.id, info.title, info.release_date, info.poster_path, info.overview);
        });
        res.status(200).json(arr2);
    }).catch((error) => {
        errorCatch(error, req, res);
    })
}
/////////////////////////////////////////****Task 12****/////////////////////////////////////////////



/////////////////////////////////////////****Task 13****/////////////////////////////////////////////
function addMovie(req, res) {
    const obj = req.body;
    let mySql = `INSERT INTO movie_table(title,release_date,poster_path,overview,comment) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    let arr = [obj.title, obj.release_date, obj.poster_path, obj.overview, obj.comment];
    client.query(mySql, arr).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorCatch(error, req, res);
    })
}
function getMovie(req, res) {
    let mySql = `SELECT * FROM movie_table;`;
    client.query(mySql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorCatch(error, req, res);
    });

}
/////////////////////////////////////////****Task 13****/////////////////////////////////////////////



/////////////////////////////////////////****Task 14****/////////////////////////////////////////////
function IdUpdate(req, res) {
    const id = req.params.id;
    const mov = req.body;
    const mySql = `UPDATE movie_table SET title = $1, release_date = $2, poster_path = $3, overview = $4, comment = $5 WHERE id=$6 RETURNING *;`;
    const arr = [mov.title, mov.release_date, mov.poster_path, mov.overview, mov.comment, id];
    client.query(mySql, arr).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        console.log(error);
        errorCatch(error, req, res);
    })
};

function IdDelete(req, res) {
    const id = req.params.id;
    const mySql = `DELETE FROM movie_table WHERE id=${id};`
    client.query(mySql).then(() => {
        res.status(200).send("The movie has been deleted");
    }).catch(error => {
        errorCatch(error, req, res);
    });
}
function Idsearch(req, res) {
    //console.log(req.params);
    const id = req.params.id;
    const mySql = `SELECT * FROM movie_table WHERE id=${id};`;
    client.query(mySql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {

        errorCatch(error, req, res);
    })
}
/////////////////////////////////////////****Task 14****/////////////////////////////////////////////



function catchNotFoundError(req, res) {

    res.status(404).send("page not found");

}


function errorCatch(error, req, res) {
    const err = {
        status: 500,
        responseText: error
    };

    res.status(500).send(err);

}


function replaceSpaceByPlus(string) {

    let string2 = string.replace(/ /g, "+");
    return string2;
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`my server is listining to port ${PORT}`);
    });
});

