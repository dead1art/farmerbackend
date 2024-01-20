const mongoose = require('mongoose')

const subcat = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorie'
    },
    name:{
        type:String,
        trim:true,
        required: true,
    },
    description:{
        type:String,
    }
},{versionKey: false,timestamps:true})


const Subcat = mongoose.model('Sub',subcat);

module.exports = Subcat;