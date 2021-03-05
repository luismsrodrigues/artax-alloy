const configuration = require('./lib/configuration');

//Load services
require('./lib/services');

const DEBUG = require('debug')('APP');
const CONFIGURATION = require('./lib/configuration');

// DEBUG("CONFIGURATION", "PORT", process.env.APP_PORT);
// DEBUG("CONFIGURATION", "DEBUG OPTIONS", process.env.DEBUG);
// DEBUG("CONFIGURATION", "ENVIRONMENT", process.env.NODE_ENV);
// DEBUG("CONFIGURATION", "RESOURCES PATH", process.env.PATH_TO_RESOURCES);

// DEBUG("CONFIGURATION", "OBS PATH", process.env.OBS_PATH);
// DEBUG("CONFIGURATION", "START OBS ON INIT", process.env.START_OBS_ON_INIT);
// DEBUG("CONFIGURATION", "CONNECT OBS ON INIT", process.env.CONNECT_OBS_ON_INIT);
