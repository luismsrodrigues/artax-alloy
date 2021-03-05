const DEBUG = require('debug')('CSGO_INTEGRATION');
const State = require('./state');

module.exports = (CONFIGURATION, UTILS, GLOBAL_STATE) => {
    const CSGO_EXE_NAME = "csgo.exe";
    const ACTIONS = {};
    
    function AddAction(actionName, action) {
        ACTIONS[actionName] = action;
    }

    async function IsRunning() {
        return await UTILS.Process.isRunning(CSGO_EXE_NAME);
    }

    async function startAndConnect(ip) {
        if(State.Get().Running) throw "CS GO IT'S RUNNING."
        return await UTILS.Process.start(`"steam://run/730//-window +connect ${ip}"`).OpenProgram();
    }

    async function stop() {
        if(State.Get().Running)
        return await UTILS.Process.stop(CSGO_EXE_NAME);
    }

    State.AddEffect(async (oldState, newState) => {
        let tempState = JSON.stringify(newState);
        DEBUG("STATE", JSON.stringify(tempState));
        await ACTIONS["StateChange"](tempState);
    });

    return {
        GetState: () => State.Get(),
        StartAndConnect: startAndConnect,
        Stop: stop,

        AddAction,
        CheckState: async function(){
            let isRunning = await IsRunning();
            await State.Set({Running: isRunning});
        }
    };
}