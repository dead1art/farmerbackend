const express = require('express');
const {create,show, showGraph, showMainGraph, deleteCat, generateExcel, weekGraph} = require("../../controller/categorie/categorie.controller");
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

    router.post("/",[authJwt.verifyToken],create);
    router.get("/",[authJwt.verifyToken],show);
    router.get("/graph",[authJwt.verifyToken],showGraph);
    router.get("/main",[authJwt.verifyToken],showMainGraph);
    router.delete("/:id",[authJwt.verifyToken],deleteCat)
    router.get("/generate",[authJwt.verifyToken],generateExcel)
    router.get("/weekgraph",[authJwt.verifyToken],weekGraph)

    app.use('/api/categorie', router)
}