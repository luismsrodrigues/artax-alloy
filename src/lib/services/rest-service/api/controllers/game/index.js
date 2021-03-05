const DEBUG = require('debug')('GAME');
const ROUTER  =  require('express').Router();
const isIp = require('is-ip');

module.exports = function (OBS_INTEGRATION, GLOBAL_STATE, CSGO_INTEGRATION) {

    ROUTER.get("/status", (request, response, next) => {
        response.json(CSGO_INTEGRATION.GetState());
        next();
    });

    
    ROUTER.get("/start/csgo", (request, response, next) => {
        function validateNum(input, min, max) {
            var num = +input;
            return num >= min && num <= max && input === num.toString();
        }

        function validateIpAndPort(input) {
            if(!input) return false;
            var parts = input.split(":");
            var ip = parts[0].split(".");
            var port = parts[1];
            return validateNum(port, 1, 65535) &&
                ip.length == 4 &&
                ip.every(function (segment) {
                    return validateNum(segment, 0, 255);
                });
        }

        try {
            let ip = request.query.ip;
            if (!validateIpAndPort(ip)) {  
                throw "Invalid ip.";
            }  

            response.json(CSGO_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }
        next();
    });

    
    ROUTER.get("/stop/csgo", (request, response, next) => {
        response.json(CSGO_INTEGRATION.GetState());
        next();
    });

    return [
        ROUTER
    ]
}