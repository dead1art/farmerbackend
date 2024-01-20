const mongoose = require('mongoose')

const expense = new mongoose.Schema({
    sub_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Sub'
    },
    name:{
        type:String,
    },
    amount:{
        type:Number,
    }
},{versionKey:false, timestamps:true})

const Expense = mongoose.model('Expense',expense)

module.exports = Expense;