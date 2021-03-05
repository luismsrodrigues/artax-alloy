const DEBUG = require('debug')('REST');
const EXPRESS = require('express');
const REST =  EXPRESS();
const CORS = require('cors');
const BODY_PARSER = require('body-parser');

module.exports = function (OBS_INTEGRATION, GLOBAL_STATE, CSGO_INTEGRATION) {

    REST.use(CORS());
    REST.use(BODY_PARSER.json());

    REST.use((req, res, next)=> {
        DEBUG(req.method + ' ' + req.url);
        next();
    });
    
    REST.use("/api", require("./api")(OBS_INTEGRATION, GLOBAL_STATE, CSGO_INTEGRATION));
    
    REST.use((request, response, next) => {
        DEBUG(response.statusCode);
        next();
    });
    
    return REST;
};