const DEBUG = require('debug')('CSGO_INTEGRATION');
const State = require('./state');
const { ExecuteAction } = require('../index');

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
        await UTILS.Process.start(`"steam://run/730//-window +connect ${ip}"`).OpenProgram();
        await State.Set({Running: true, Ip: ip});
    }

    async function stop() {
        if(State.Get().Running)
        await UTILS.Process.stop(CSGO_EXE_NAME);
        await State.Set({Running: false, Ip: null});        
    }

    State.AddEffect(async (oldState, newState) => {
        let tempState = JSON.stringify(newState);
        DEBUG("STATE", JSON.stringify(tempState));
        await ExecuteAction(ACTIONS["StateChange"], tempState);
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