const IO = require('socket.io');
const DEBUG = require('debug')('SOCKET_IO_SERVICE');
const JWT = require('jsonwebtoken');

module.exports = (HTTP_PROVIDER) => {
    const IO_PROVIDER = IO(HTTP_PROVIDER, {
        cors: {
          origin: '*',
        }
      });

    IO_PROVIDER.use((socket, next) => {
        let token = socket.handshake.auth.token;

        if (!token) return socket.close();
        
        JWT.verify(token, process.env.SECRET, function(err, decoded) {
          if (err) return socket.close();
          
        //   req.userId = decoded.id;
          next();
        });
    });
    
    const PROVIDERS = [];

    function Init(callbacks) {
        DEBUG("STARTED");
        IO_PROVIDER.on('connection', async (socket) => {
            DEBUG("USER CONNECTED");
    
            callbacks.forEach(async callback => {
                await callback();
            });

            PROVIDERS.forEach(provider => {
                socket.on(provider.chatName, (data) => provider.callback(data));
            });

            socket.on('disconnect', () => {
                DEBUG("USER DISCONNECTED");
            });
        });        
    }

    function Emit(chat, message) {
        IO_PROVIDER.emit(chat, message);
    }

    function OnMessage(chatName, cb) {
        PROVIDERS.push({chatName, callback: cb});
    }

    return {
        Init,
        Emit,
        OnMessage
    }
}