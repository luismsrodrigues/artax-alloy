const CONFIGURATION = require('./configuration')();
const GLOBAL_STATE = require('./state');
const UTILS = require('../utils');
const DEBUG = require('debug')('LIB');

(async function () {
    DEBUG("STARTING");

    let result = await UTILS.Alert.Error({title: "TEST TITLE", message: "TEST MESSAGE"}); 
    DEBUG(result);
    DEBUG("DONE");

    await require('./services')(CONFIGURATION, GLOBAL_STATE, UTILS);
})();
