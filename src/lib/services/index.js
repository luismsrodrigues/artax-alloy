const UTILS = require('../utils');

module.exports = async function (Configuration, GlobalState) {
    const DEBUG = require('debug')('SERVICE');
    const OBS_INTEGRATION = await require('../integrations/obs-integration')(Configuration, UTILS, GlobalState);

    let isObsPathValid = await OBS_INTEGRATION.ValidatePath();

    if(!isObsPathValid){
        DEBUG("OBS PATH", "INVALID");
        await UTILS.Application.Exit(-1);
    }

    const CSGO_INTEGRATION = require('../integrations/counter-strike-integration')(Configuration, UTILS, GlobalState);
    const REST = require("./rest-service")(OBS_INTEGRATION, GlobalState, CSGO_INTEGRATION);

    const HTTP = require('http').createServer(REST);
    const SOCKET_IO_SERVICE = require('./socket-io-service')(HTTP);

    UTILS.Application.OnBeforeExit = async () => {
        await OBS_INTEGRATION.Stop();
        await CSGO_INTEGRATION.Stop();
    }

    HTTP.listen(Configuration.App.Port, ()=>{
        DEBUG('STARTED 127.0.0.1:' + Configuration.App.Port);
    });
}

// (async function () {
//     GLOBAL_STATE.AddEffect(async (oldState, newState) => {
//         SOCKET_IO_SERVICE.Emit("globalState", JSON.stringify(newState));
//         OBS_INTEGRATION.UpdateScenes();
//     });

//     OBS_INTEGRATION.AddAction("StateChange", async (state) => {
//         SOCKET_IO_SERVICE.Emit("obsState", state);
//     });

//     CSGO_INTEGRATION.AddAction("StateChange", async (state) => {
//         SOCKET_IO_SERVICE.Emit("csgoState", state);
//     });

//     if(CONFIGURATION.START_OBS_ON_INIT){
//         await OBS_INTEGRATION.Start();
//     }

//     if(CONFIGURATION.CONNECT_OBS_ON_INIT){
//         await OBS_INTEGRATION.Connect();
//     }

//     OBS_INTEGRATION.AddAction("PreviewScreen", (image) => {
//         SOCKET_IO_SERVICE.Emit("previewScreen", image);
//     });

//     OBS_INTEGRATION.AddAction("PreviewNextScreen", (image) => {
//         SOCKET_IO_SERVICE.Emit("previewNextScreen", image);
//     });
    
//     SOCKET_IO_SERVICE.Init([
//         () => SOCKET_IO_SERVICE.Emit("globalState", JSON.stringify(GLOBAL_STATE.Get())),
//     ]);

//     setInterval(async () => {
//         await OBS_INTEGRATION.CheckState();
//         await CSGO_INTEGRATION.CheckState();
//     }, 2000);
// })();