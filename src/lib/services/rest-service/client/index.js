const DEBUG = require('debug')('CLIENT');
const ROUTER =  require('express').Router();

ROUTER.get("/", (request, response) => {
    response.sendFile('index.html');
});

module.exports = [
    ROUTER
]