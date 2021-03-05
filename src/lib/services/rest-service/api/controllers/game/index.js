const DEBUG = require('debug')('GAME');
const ROUTER  =  require('express').Router();
const UTILS = require('../../../../../utils');

ROUTER.get("/", (request, response, next) => {
    UTILS.Process.isRunning('csgo.exe', (status) => {
        DEBUG("STATUS", status ? "Running" : "Not Running");
    });
    response.json({
        game: "CS GO"
    });
    next();
});

module.exports = [
    ROUTER
]