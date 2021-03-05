const DEBUG = require('debug')('SERVICE');
const GLOBAL_STATE = require('../state');

const CONFIGURATION = require('../configuration');
const UTILS = require('../utils');
const OBS_INTEGRATION = require('../integrations/obs-integration')(CONFIGURATION, UTILS, GLOBAL_STATE);

const REST = require("./rest-service")(OBS_INTEGRATION, GLOBAL_STATE);
const HTTP = require('http').createServer(REST);
const SOCKET_IO_SERVICE = require('./socket-io-service')(HTTP);

UTILS.Application.OnBeforeExit = async () => {
    await OBS_INTEGRATION.Stop();
}

HTTP.listen(process.env.APP_PORT, ()=>{
    DEBUG('STARTED 127.0.0.1:' + process.env.APP_PORT);
});

(async function () {
    const isValidPath = await UTILS.Directory.Exists(process.env.OBS_PATH);

    if(!isValidPath){
        DEBUG("OBS PATH", "INVALID");
        await UTILS.Application.Exit(-1);
    }

    GLOBAL_STATE.AddEffect(async (oldState, newState) => {
        SOCKET_IO_SERVICE.Emit("globalState", JSON.stringify(newState));
        OBS_INTEGRATION.UpdateScenes();
    });

    if(CONFIGURATION.START_OBS_ON_INIT){
        await OBS_INTEGRATION.Start();
    }

    if(CONFIGURATION.CONNECT_OBS_ON_INIT){
        await OBS_INTEGRATION.Connect();
    }

    OBS_INTEGRATION.AddAction("PreviewScreen", (image) => {
        SOCKET_IO_SERVICE.Emit("previewScreen", image);
    });

    OBS_INTEGRATION.AddAction("PreviewNextScreen", (image) => {
        SOCKET_IO_SERVICE.Emit("previewNextScreen", image);
    });
    
    await GLOBAL_STATE.Set({ DisplayActive: "LIVE" });
    
    SOCKET_IO_SERVICE.Init([
        () => SOCKET_IO_SERVICE.Emit("globalState", JSON.stringify(GLOBAL_STATE.Get())),
    ]);


    setInterval(async () => {
        await OBS_INTEGRATION.CheckState();
    }, 2000);
})();