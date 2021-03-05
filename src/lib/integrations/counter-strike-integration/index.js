const DEBUG = require('debug')('CSGO_INTEGRATION');
const State = require('./state');

module.exports = (CONFIGURATION, UTILS, GLOBAL_STATE) => {
    return {
        GetState: () => State.Get(),
        StartAndConnect: null,
        Stop: null
    };
}