require('dotenv').config();

const CLIENT_PROVIDER = function (API_URL) {
    const EXPRESS = require('express');
    const APP = EXPRESS();
    const HTTP = require('http').createServer(APP);
    const PATH = require('path');

    const PROXY = require('http-proxy-middleware')
    const APIP_PROXY = PROXY.createProxyMiddleware('/api', {target: API_URL});
    APP.use(APIP_PROXY)

    console.log(PATH.join(__dirname, process.env.PATH_TO_RESOURCES));

    if (process.env.NODE_ENV === "development") {
        APP.use('/', EXPRESS.static(PATH.join(__dirname, process.env.PATH_TO_RESOURCES)))
    }

    if (process.env.NODE_ENV === "production") {
        APP.use('/', EXPRESS.static(PATH.join(process.env.PATH_TO_RESOURCES)))
    }

    APP.get('/', (request, response) => {
        response.sendFile('index.html');
    });

    HTTP.listen(process.env.CLIENT_PORT, () => {
        console.log('listening on *:' + process.env.CLIENT_PORT);
    });
};


CLIENT_PROVIDER("http://localhost:" + process.env.APP_PORT);

module.exports = CLIENT_PROVIDER;