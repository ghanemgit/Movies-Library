'use strict'

const data_jason = require('./Movie Data/data.json');
const express = require('express');
const cors = require('cors');
//const error = require('./Movie Data/error.json');
const server = express();
server.use(cors());


server.get('/', homePage);
server.get('/favorite', favorite);
server.get('*', catchError);



function dataConstructor(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorCons(status, responseText) {
    this.status = status;
    this.responseText = responseText;
}

function homePage(req, res) {

    let obj = new dataConstructor(data_jason.title, data_jason.poster_path, data_jason.overview);

    res.status(200).json(obj);
}

function favorite(req, res) {
    res.status(200).send("Welcome to Favorite Page");
}

function catchError(req, res) {

    res.status(404).send("page not found");

}



server.listen(3000, () => {
    console.log("my server is listining to port 3000");
});


