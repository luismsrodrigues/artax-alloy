(async function () {
    const CONFIGURATION = require('./configuration')();
    const DEBUG = require('debug')('HTTP_CLIENT');
    const AXIOS = require('axios').default;
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

    APP.get('/service/config', async (request, response) => {
        response.json({api_path: CONFIGURATION.Api.Path, wss_path: CONFIGURATION.WSS.Path});
    });
    
    APP.get('/service/login', async (request, response) => {
        AXIOS.post(`http://127.0.0.1:12081/api/login`, {
            user: 'admin',
            password: 'IVFBWjJ3c3g='
        }).then((res) => {
            response.json(res.data);
        }).catch((error) => {
            console.log(error);
            response.status(403).json({type: error.code, message: "Service is down."});
        });
    });

    HTTP.listen(CONFIGURATION.Client.Port, () => {
        DEBUG("http://localhost:" + CONFIGURATION.Client.Port);
    });
})();
