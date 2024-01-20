const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authJwt = require('../middleware/authJwt');

const {signup,login, getProfile} = require('../controller/auth.controller')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.post('/api/auth/signin',
    [
        check('email', 'Please enter valid email address').isEmail()
    ],
    signup)

    app.post('/api/auth/login',[
        check('email','Please enter a valid email address').isEmail(),
        check('password', 'Password should be minimum of 8 characters')
        .not()
        .isEmpty(),
    ],
    login)
}