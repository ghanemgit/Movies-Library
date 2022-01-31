'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const error = require('./Movie Data/error.json');
const axios = require('axios');
const server = express();
const PORT = process.env.PORT;
const KEY = process.env.KEY;

server.use(cors());

server.get('/', homePage);
server.get('/trending', trending);
server.get('/search', search);
server.use('*', catchNotFoundError);
server.use(errorCatch);

function MovieInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

// function errorCons(status, responseText) {
//     this.status = status;
//     this.responseText = responseText;
// }

let user_language_search = "en-US";
let userSearch = "Jack Reacher";//i create function to replace space by plus sign below {replaceSpaceByPlus(string)}
let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=${user_language_search}&query=${replaceSpaceByPlus(userSearch)}`;
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
            //console.log(resultComeFromAPI.data.results);
            arr = resultComeFromAPI.data.results.map(info => {
                return new MovieInfo(info.id, info.title, info.release_date, info.poster_path, info.overview);
            });
            res.status(200).json(arr);
        }).catch((err) => {
            errorCatch(err, req, res);
        })

}




function search(req, res) {

    let arr2 = [];
    axios.get(searchUrl).then((resultComeFromAPI) => {
        //console.log(resultComeFromAPI.data.results)
        arr2 = resultComeFromAPI.data.results.map(info => {
            return new MovieInfo(info.id, info.title, info.release_date, info.poster_path, info.overview);
        });
        res.status(200).json(arr2);
    }).catch((error) => {
        errorCatch(error, req, res);
    })


}


function catchNotFoundError(req, res) {

    res.status(404).send("page not found");

}


function errorCatch(error, req, res) {
    const err = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    };

    res.status(500).send(err);

}


function replaceSpaceByPlus(string) {

    let string2 = string.replace(/ /g, "+");
    return string2;
}



server.listen(PORT, () => {
    console.log(`my server is listining to port ${PORT}`);
});
