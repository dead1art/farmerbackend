const db = require("../model/index")
const { validationResult } = require('express-validator');
const AppError = require('../utils/appErrors');
const jwt = require('jsonwebtoken');
const comparePassword = require("../middleware/compare");
var bcrypt = require("bcryptjs");

const User = db.user;
const Profile = db.profile;

exports.signupValidation = (req,res,next)=>{
}

//Create a profile on login
const createProfile = async (id,email,name)=>{
    const profile = await Profile.findOne({
        user: id,
    })
    if(!profile){
        console.log("Enters")
        const profile = await Profile.create({
            user: id,
            email: email,
            name: name,
        })
        return profile;
    }
    return profile;
}

//Method for login
exports.login = async (req,res,next)=>{
    const user = await  User.findOne({
        email: req.body.email,
    })
    if(!user){
        console.log("No such users here")
        return res.status(400).json({
            message:"No such users exists"
        })
    }

    var passwordIsValid =bcrypt.compareSync(
        req.body.password,
        user.password
      );

    if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

    console.log(user)

    const profile = await createProfile(user._id,user.email,user.name)

    var token = jwt.sign({ id: user._id },process.env.SECRET, {
        expiresIn: 130000 
      });

    res.status(200).send({
        id: user._id,
        username: user.name,
        email: user.email,
        accessToken: token,
        profile: profile
    });
}


//Method for signup
exports.signup = async (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(500).send({
            message: errors,
        })
    }
    const user = await User.findOne({
        email: req.body.email,
    })
    if(user){
         return res.status(401).send({
            message:"User already exits!!",
         });
    }
    const user_response = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
      });
    return res.status(200).json({
        status:'success',
        data: 'Verified!!',
        user:user_response
    })
}



