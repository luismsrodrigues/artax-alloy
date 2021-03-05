const DEBUG = require('debug')('API');
const ROUTER  =  require('express').Router();
const JWT = require('jsonwebtoken');

module.exports = function(OBS_INTEGRATION, GLOBAL_STATE){

    ROUTER.get("/version", (request, response, next) => {
        response.json({
            timestamp: Date.now(),
            status: "ON",
            version: "1.0.0"
        });
        next();
    });

    ROUTER.post('/login', (req, res, next) => {
        if(req.body.user === process.env.APP_USER && Buffer.from(req.body.password).toString('utf-8') === Buffer.from(process.env.APP_PASSWORD).toString('utf-8')){
          const token = JWT.sign({ user: process.env.APP_USER }, process.env.SECRET, {
            expiresIn: 5000
          });
          return res.json({ auth: true, token: token });
        }
        
        res.status(500).json({message: 'Not valid user.'});
    });

    ROUTER.use((request, response, next) => {
        try {
            const token = request.headers['authorization'].replace('Bearer ', '');
            if (!token) throw "Invalid User";
            JWT.verify(token, process.env.SECRET, function(err, decoded) {
                if (err) return response.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
                
              //   req.userId = decoded.id;
                next();
              });
        } catch (error) {
            return response.status(401).json({ auth: false, message: 'No token provided.' });
        }
    });
    
    ROUTER.use("/game", require("./controllers/game"));
    ROUTER.use("/obs", require("./controllers/obs")(OBS_INTEGRATION, GLOBAL_STATE));
    ROUTER.use("/central", require("./controllers/central")(OBS_INTEGRATION, GLOBAL_STATE));

    return [
        ROUTER
    ];
}