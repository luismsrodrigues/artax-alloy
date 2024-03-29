const CONFIGURATION = require('./configuration')();
const GLOBAL_STATE = require('./state');
const UTILS = require('../utils');
const DEBUG = require('debug')('LIB');

(async function () {
    DEBUG("STARTING");
    await require('./services')(CONFIGURATION, GLOBAL_STATE, UTILS);
})();
