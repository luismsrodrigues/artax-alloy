(async function () {
    const CONFIGURATION = require('./configuration')();
    const DEBUG = require('debug')('HTTP_CLIENT');
    DEBUG("STARTING");

    const EXPRESS = require('express');
    const APP = EXPRESS();
    const HTTP = require('http').createServer(APP);
    const PATH = require('path');
    
    APP.use(require('http-proxy-middleware').createProxyMiddleware('/api', {
        target: CONFIGURATION.Api.Path,
        logLevel: 'silent'
    }))
    
    if (CONFIGURATION.Environment === "dev") {
        const RELOAD = require('reload');
        RELOAD(APP);
        APP.use(EXPRESS.static(PATH.resolve(__dirname, 'www')));
    }else{
        APP.use('/', EXPRESS.static(PATH.join(process.env.PATH_TO_RESOURCES)))
    }
    
    APP.get('/', (request, response) => {
        response.sendFile('index.html');
    });
    
    HTTP.listen(CONFIGURATION.Client.Port, () => {
        DEBUG("http://localhost:" + CONFIGURATION.Client.Port);
    });
})();
