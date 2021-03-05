const configuration = require('./lib/configuration');

const DEBUG = require('debug')('APP');
const CONFIGURATION = require('./lib/configuration');

require('./lib/services');
// require('./client')("http://localhost:" + process.env.APP_PORT);