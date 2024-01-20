const mongoose = require('mongoose');
const Expense = require('../../model/category/expenses.model');
const db = require('../../model/index')

const User = db.user;
const Sub = db.sub;
const Categorie = db.categorie;

exports.create=async(req,res,next)=>{
    console.log("Name",req.body.name)
    console.log("Amount",req.body.amount)
    console.log("subcategory id",req.body.id);
    if(!req.body.name){
        res.status(401).send({
            message:"Please provide a body"
        })
    }
    const user_token = req.userId;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const subcat_id = req.body.id;
    const subcat = await Sub.findOne().where('_id').equals(subcat_id);
    console.log({subcat})

    if(!subcat){
        return res.status(401).send({
            message:"No such subcategory"
        })
    }
    await Expense.create({
        sub_id:subcat._id,
        name:req.body.name,
        amount:req.body.amount,
    },{versionKey:false, timestamps:true})

    return res.status(200).json({
        Status:"Created",
    })
}

exports.show = async(req,res,next)=>{
    const user_token = req.userId;
    const sub_id = req.params.sub;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const response = await Expense.find().where('sub_id').equals(sub_id);
    const data = []
    response.map((item)=>{
        if(item.amount!=0){
            const result = {
                _id: item._id,
                name: item.name,
                amount:item.amount,
                createdAt:item.createdAt
            }
            data.push(result)
        }
    })
    return res.status(200).json({
        response:data
    })
}

exports.deleteExpeses = async(req,res,next)=>{
    const user_token = req.userId;
    const exp_id = req.params.id;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const response = await Expense.deleteOne().where('_id').equals(exp_id);
    return res.status(200).json({
        response
    })
}

exports.pdfGenerate = async(req,res,next)=>{
    const user_token = req.userId;
    const user = await User.findOne().where('_id').equals(user_token);
    if(!user){
        return res.status(401).send({
            message:"Wrong user or token provided"
        })
    }
    const agg = [
        {
          '$group': {
            '_id': '$sub_id', 
            'total': {
              '$sum': '$amount'
            }
          }
        }, {
          '$lookup': {
            'from': 'subs', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'categories', 
            'localField': 'result.cat_id', 
            'foreignField': '_id', 
            'as': 'main'
          }
        }, {
          '$unwind': {
            'path': '$main', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            'main.user_id': user._id
          }
        }
      ]
    const response = await Expense.aggregate(agg);
    return res.status(201).json({
        response
    })
}
