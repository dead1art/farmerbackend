const authJwt = require('../middleware/authJwt');
const {showProfile} = require('../controller/profile.controller');

module.exports = function(app){
    var router = require("express").Router();
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    router.get("/",[authJwt.verifyToken],showProfile);

    app.use('/api/profile', router)
}