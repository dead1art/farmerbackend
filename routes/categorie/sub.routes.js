const express = require('express');

const {create,show, deleteSub} = require('../../controller/categorie/sub.controller');
const authJwt = require('../../middleware/authJwt');

module.exports = function(app){
    var router = require("express").Router();
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    router.post('/',[authJwt.verifyToken],create)
    router.get('/:sub',[authJwt.verifyToken],show)
    router.delete('/:id',[authJwt.verifyToken],deleteSub)
    
    app.use('/api/sub',router)
}