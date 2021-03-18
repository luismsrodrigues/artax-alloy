(async function () {
    const CONFIGURATION = require('./configuration')();
    const DEBUG = require('debug')('HTTP_CLIENT');
    DEBUG("STARTING");

    const EXPRESS = require('express');
    const APP = EXPRESS();
    const HTTP = require('http').createServer(APP);
    const PATH = require('path');

    if (CONFIGURATION.Environment === "dev") {
        const RELOAD = require('reload');
        RELOAD(APP);
        APP.use(EXPRESS.static(PATH.resolve(__dirname, 'www')));
    }else{
        APP.use(EXPRESS.static(PATH.resolve('.', 'www')))
    }

    DEBUG("RESOURCE_PATH", PATH.resolve('.', 'www'));
    
    APP.get('/', (request, response) => {
        response.sendFile('index.html');
    });
    
    HTTP.listen(CONFIGURATION.Client.Port, () => {
        DEBUG("http://localhost:" + CONFIGURATION.Client.Port);
    });
})();
