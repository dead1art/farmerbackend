const mongoose = require('mongoose')

const receipt = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receipt_name:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
        required:false
    },
    comment:{
        type:String,
    }
    }
)

const Receipt = mongoose.model("Receipt",receipt);

module.exports = Receipt;