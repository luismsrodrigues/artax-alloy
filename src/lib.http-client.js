(async function () {
    require("dotenv/config");
    await require('./lib');
    await require('./clients/http-client/http-client.provider');
})();
