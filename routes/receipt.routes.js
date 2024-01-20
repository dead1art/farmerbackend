const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const {create, createReport, getReport, deleteReport} = require('../controller/receipt.controller')
const multer = require('multer');

const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
});


module.exports = function(app){
    var router = require("express").Router();
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    router.post("/uploadImage",upload.single("myFile"),create);
    router.post("/uploadReport",[authJwt.verifyToken],createReport);
    router.get("/",[authJwt.verifyToken],getReport)
    router.delete("/:id",[authJwt.verifyToken],deleteReport)

    app.use('/api/receipt', router)
}