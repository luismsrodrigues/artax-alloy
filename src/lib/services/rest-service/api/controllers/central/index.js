const DEBUG = require('debug')('OBS_API');
const ROUTER  =  require('express').Router();

module.exports = function(OBS_INTEGRATION, GLOBAL_STATE, CSGO_INTEGRATION){

    ROUTER.get("/status", (request, response, next) => {
        response.json(GLOBAL_STATE.Get());
        next();
    });

    ROUTER.get("/display/change", async (request, response, next) => {
        
        try {
            let display = request.query.name;
            if(!display){
                throw "Invalid display."
            }

            await GLOBAL_STATE.Set({DisplayActive: display});

            response.json(OBS_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    return [
        ROUTER
    ];
};