const db = require('../model/index')

const Profile = db.profile;
const User = db.user;

exports.showProfile = async(req,res,next)=>{
    const user_id = req.userId
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    if(!user){
        return res.status(200).send({
            message:"No such user!!"
        })    
    }
    const profile = await Profile.findOne().where("user").equals(user_id)
    if(profile){
        return res.status(200).json({
            profile
        })
    }
    return res.status(404).json({
        message:"No such profile",
    })
}