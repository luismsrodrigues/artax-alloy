require('dotenv').config();

module.exports = {
    START_OBS_ON_INIT: process.env.START_OBS_ON_INIT === 'true',
    CONNECT_OBS_ON_INIT: process.env.CONNECT_OBS_ON_INIT === 'true',

    MODULE_PREVIEW_STREAM_FPS: process.env.MODULE_PREVIEW_STREAM_FPS || 10,
    MODULE_PREVIEW_STREAM: process.env.MODULE_PREVIEW_STREAM  === 'true',
};