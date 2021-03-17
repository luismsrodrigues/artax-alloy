module.exports = function () {
    if(process.env.NODE_ENV === 'dev'){
        require('dotenv').config({path: __dirname + '/.env'})
    }else{
        require('dotenv').config();
    }

    function stringToBoolean(value) {
        return value === 'true';
    }
    
    return {
        Obs: {
            Path: process.env.OBS_PATH,
            StartObsOnInit: stringToBoolean(process.env.START_OBS_ON_INIT),
            ConnectObsOnInit: stringToBoolean(process.env.CONNECT_OBS_ON_INIT),
        },

        App: {
            Port: process.env.APP_PORT
        },

        Modules:{
            PreviewStream:{
                Active: stringToBoolean(process.env.MODULE_PREVIEW_STREAM),
                Fps: process.env.MODULE_PREVIEW_STREAM_FPS || 10,
            }
        },
    }
} 
