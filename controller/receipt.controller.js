const mongoose = require('mongoose')
const db = require('../model/index')
const multer = require('multer');
const s3Multer = require('multer-s3')
const B2 = require('backblaze-b2');
const fs = require('fs')
const process = require('process');
const Receipt = require('../model/receipt.model');

const receipt = db.receipt;
const User = db.user;

let applicationKeyId = process.env.APPLICATION_KEY_ID
let applicationKey = process.env.APPLICATION_KEY



const b2 = new B2({
  applicationKeyId, // or accountId: 'accountId'
  applicationKey // or masterApplicationKey
});


async function uploadFile({filename,length,mime,data}){
  try{
    await b2.authorize();
    let url = await b2.getUploadUrl({
      bucketId: '3fff727e2439eed08f860014'
      }); 
      
      const response = await b2.uploadFile({
        uploadUrl:url.data.uploadUrl,
        uploadAuthToken: url.data.authorizationToken,
        fileName:filename,
        contentLength:length,
        mime:mime,
        data:data,
        onUploadProgress: (event) => {
          console.log('Uploading!!!!!');
        }
      });
      console.log(response);
    }
  catch(err){
    console.log("Error!!!!!!!!!");
    console.log(err);
  }
}


exports.create = async(req,res,next)=>{
  let filename = req.file.originalname;
  let length = req.file.size;
  let mime = req.file.mimetype;
  let filePath = req.file.path;
  fs.readFile(filePath, (err, data) => {
    if (err) throw err; // Fail if the file can't be read.
    var oldData = data;
    let str = data.toString('base64')
    data = Buffer.from(str, 'base64');
    uploadFile({filename,length,mime,data});
    let url  = "https://f005.backblazeb2.com/file/testisnotsorandom/"+filename;
    res.send({
      url
    });
  });
  fs.unlink(filePath,(err)=>{
    if (err) throw err;
    console.log("Deleted!!!!!!");
  })
}

exports.createReport = async(req,res,next)=>{
  const user_id = req.userId;
  console.log(user_id);
  const user = await User.findOne().where("_id").equals(user_id)
  console.log(user)
  if(!user){
      return res.status(404).send({
          message:"No such user",
      })
  }
  await receipt.create({
    user_id:user._id,
    receipt_name:req.body.receipt_name,
    image_url:req.body.image_url,
    comment:req.body.comment
  })
  return res.status(200).json({
    message:"Added successfully!!!!!"
  })
}

exports.getReport = async(req,res,next)=>{
  const user_id = req.userId;
  console.log(user_id);
  const user = await User.findOne().where("_id").equals(user_id)
  console.log(user)
  if(!user){
    return res.status(404).send({
      message:"No such user!!!",
    })
  }
  const response = await Receipt.find({}).where('user_id').equals(user._id);
  return res.status(200).json({
    response
  })
}

exports.deleteReport = async(req,res,next)=>{
  const report_id = req.params.id;
  const user_id = req.userId;
  console.log(user_id);
  const user = await User.findOne().where("_id").equals(user_id);
  console.log(user)
  if(!user){
    return res.status(404).send({
      message:"No such user!!!"
    })
  }
  console.log(report_id);
  const report = await Receipt.findOne().where('_id').equals(report_id);
  if(!report){
    return res.status(404).send({
      message:"No such receipt"
    })
  }
  const response = await Receipt.deleteOne().where('_id').equals(report._id);
  console.log(response);
  return res.status(200).json({
    message:"Deleted successfully!!!"
  })
}