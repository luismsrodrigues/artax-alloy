const DEBUG = require('debug')('OBS_API');
const ROUTER  =  require('express').Router();

module.exports = function(OBS_INTEGRATION, GLOBAL_STATE, CSGO_INTEGRATION){

    ROUTER.get("/status", (request, response, next) => {
        response.json(OBS_INTEGRATION.GetState());
        next();
    });

    ROUTER.get("/stream/start", async (request, response, next) => {
        try {
            await OBS_INTEGRATION.StartStream();

            response.json(OBS_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    ROUTER.get("/stream/stop", async (request, response, next) => {
        try {
            await OBS_INTEGRATION.StopStream();

            response.json(OBS_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    ROUTER.get("/stream/scene/preview/change", async (request, response, next) => {
        
        try {
            let sceneName = request.query.name;
            if(!sceneName){
                throw "Invalid scene name."
            }

            await OBS_INTEGRATION.SetNewPreviewScene(sceneName);

            response.json({screenShoot: await OBS_INTEGRATION.GetPreviewScene()});
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    ROUTER.get("/stream/scene/live/change", async (request, response, next) => {
        
        try {
            let sceneName = request.query.name;
            if(!sceneName){
                throw "Invalid scene name."
            }

            await OBS_INTEGRATION.SetNewLiveScene(sceneName);

            response.json(OBS_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    ROUTER.get("/start", async (request, response, next) => {
        
        try {
            await OBS_INTEGRATION.Start();

            response.json(OBS_INTEGRATION.GetState());
        } catch (error) {
            response.status(500).json({errorMessage: error});
        }

        next();
    });

    ROUTER.get("/stop", async (request, response, next) => {
        
        try {
            await OBS_INTEGRATION.Stop();

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