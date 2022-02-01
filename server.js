'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const server = express();
const PORT = process.env.PORT;
const KEY = process.env.KEY;
const client = new pg.Client(process.env.DATABASE_URL);
server.use(cors());
server.use(express.json());

server.get('/', homePage);
server.get('/trending', trending);
server.get('/search', search);

server.post('/addMovie', addMovie);
server.get('/getMovies', getMovie);

server.use('*', catchNotFoundError);
server.use(errorCatch);

function MovieInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


let user_language_search = "en-US";

let userSearch = "Jack Reacher";//i create function to replace space by plus sign below {replaceSpaceByPlus(string)}

let user_media_type = "all";
let user_time_window = "week";
let trendingUrl = `https://api.themoviedb.org/3/trending/${user_media_type}/${user_time_window}?api_key=${KEY}&language=${user_language_search}`;

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
    //let userSearch = req.query.userSearch;
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

function addMovie(req, res) {
    const obj = req.body;
    let mySql = `INSERT INTO movietable(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let arr = [obj.title, obj.release_date, obj.poster_path, obj.overview];
    client.query(mySql, arr).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorCatch(error, req, res);
    })
}


function getMovie(req, res) {
    let sql = `SELECT * FROM movietable;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorCatch(error, req, res);
    });

}


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

