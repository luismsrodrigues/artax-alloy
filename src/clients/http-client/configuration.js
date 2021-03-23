const PATH = require('path');

module.exports = function () {
    if(process.env.NODE_ENV === 'dev'){
        require('dotenv').config({path: __dirname + '/.env'})
    }else{
        require('dotenv').config({path: PATH.resolve('.', '.http-client.env')});
    }

    return {
        Environment: process.env.NODE_ENV,
        Api:{
            Path: process.env.API_URL
        },
        WSS:{
            Path: process.env.WSS_URL
        },
        Client:{
            Port: process.env.CLIENT_PORT
        }
    }
} 
