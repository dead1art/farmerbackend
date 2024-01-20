const db = require('../../model/index')
const authJwt = require("../../middleware/authJwt")
const { where } = require('../../model/user.model')
const { categorie } = require('../../model/index')


const Categorie = db.categorie
const User = db.user

const getUserId =async (id)=>{
    const res_id = await User.find({_id:id})
    console.log("The user is",res_id)
    return res_id
}

exports.create=async(req,res,next)=>{
    if(!req.body.name){
        return res.status(400).send({
            message:"Please provide with a name"
        })
    }
    const user_id = req.userId;
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    if(!user){
        return res.status(404).send({
            message:"No such user",
        })
    }
    console.log()
    const categorie = await Categorie.create({
        name:req.body.name,
        user_id:user._id,
    })
    return res.status(200).json({
        message:"Created",
        category:categorie,
    })
}

exports.show = async(req,res,next)=>{
    const user_id = req.userId
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    const category = await Categorie.find({}).where('user_id').equals(user._id)
    return res.status(200).json({
        result:category
    })
}

exports.deleteCat = async(req,res,next)=>{
  const cat_id = req.params.id;
  const user_id = req.userId;
  console.log(cat_id)
  const user = await User.findOne().where("_id").equals(user_id)
  if(!user){
    return res.status(401).send({
      message:"No such user",
    })
  }
  const category = await Categorie.findOne().where('_id').equals(cat_id);
  if(!category){
    return res.status(404).send({
      message:"No such category exists",
    })
  }
  const response = await Categorie.deleteOne().where('_id').equals(cat_id)
  return res.status(200).json({
    response
  })
}

exports.showGraph = async(req,res,next)=>{
    const user_id = req.userId
    let year = Number(req.query.year);
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    const agg = [
        {
          '$match': {
            'user_id': user._id
          }
        }, {
          '$lookup': {
            'from': 'subs', 
            'localField': '_id', 
            'foreignField': 'cat_id', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$group': {
            '_id': '$result.cat_id', 
            'x': {
              '$first': '$name'
            }, 
            'y': {
              '$sum': 1
            }
          }
        }, {
          '$project': {
            '_id': 0,
          }
        }
      ];
    const cursor = await Categorie.aggregate(agg);
    return res.status(200).json({
        graph:cursor
    })      
}

exports.showMainGraph = async(req,res,next)=>{
    const user_id = req.userId
    let year = 2023;
    year = Number(req.query?.year);
    console.log("User id from get request",user_id);
    const user = await User.findOne().where("_id").equals(user_id)
    console.log(user)
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const agg = [
      {
        '$match': {
          'user_id': user._id,
          '$expr': { '$eq': [{ '$year': '$createdAt' }, year] }
        }
      },
      {
          '$lookup': {
              'from': 'subs', 
              'localField': '_id', 
              'foreignField': 'cat_id', 
              'as': 'result'
          }
      }, {
          '$lookup': {
              'from': 'expenses', 
              'localField': 'result._id', 
              'foreignField': 'sub_id', 
              'as': 'main'
          }
      }, {
          '$unwind': {
              'path': '$main'
          }
      }, {
          '$group': {
              '_id': {
                  '$month': '$main.createdAt'
              },
              'y': {
                  '$sum': '$main.amount'
              }
          }
      },{
        '$project':{
          '_id':0,
          'x':'$_id',
          'y':1,
        }
      }
  ]
  const response = await Categorie.aggregate(agg);
  const result = []
  response.map((item)=>{
    result.push({
      x:months[item['x']-1],
      y:item['y']
    })
  })
  return res.status(200).json({
    result
  })
}

exports.generateExcel = async(req,res,next)=>{
  //name, category, subcategories, expenses, date
  const user_id = req.userId
  console.log("User id from get request",user_id);
  const user = await User.findOne().where("_id").equals(user_id);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const agg = [
      {
        '$match': {
          'user_id': user._id
        }
      },
      {
          '$lookup': {
              'from': 'subs', 
              'localField': '_id', 
              'foreignField': 'cat_id', 
              'as': 'result'
          }
      }, {
          '$lookup': {
              'from': 'expenses', 
              'localField': 'result._id', 
              'foreignField': 'sub_id', 
              'as': 'main'
          }
      }, {
          '$unwind': {
              'path': '$main'
          }
      }, {
          '$group': {
              '_id':'$result._id',
              'cat':{
                  '$first':'$categories.name'
              },
              'sub':{
                  '$first':'$result.name'
              },
              'total': {
                  '$sum': '$main.amount'
              }
          }
      },{
        '$project':{
          '_id':0,
          'cat':1,
          'sub':1,
          'total':1,
        }
      }
  ]
  const response = await Categorie.aggregate(agg);
  const result = []
  response.map((item)=>{
    result.push({
      month:months[item['month']-1],
      total:item['total'],
      sub_category:item['sub']
    })
  })
  return res.status(200).json({
    result,
  })
}

exports.weekGraph = async(req,res,next)=>{
  const user_id = req.userId
  let year = 2023;
  let month = 1;
  year = Number(req.query?.year);
  month = Number(req.query?.month);
  console.log("User id from get request",user_id);
  const user = await User.findOne().where("_id").equals(user_id);
  console.log(user);
  const agg = [
    {
      '$match': {
          'user_id':user._id,
    }
    }, {
      '$lookup': {
        'from': 'subs', 
        'localField': '_id', 
        'foreignField': 'cat_id', 
        'as': 'result'
      }
    }, {
      '$lookup': {
        'from': 'expenses', 
        'localField': 'result._id', 
        'foreignField': 'sub_id', 
        'as': 'main'
      }
    }, {
      '$unwind': {
        'path': '$main'
      }
    },{
      '$match': {
        'main.createdAt': {
          '$gte': new Date(Date.UTC(year, month - 1, 1)),
          '$lt': new Date(Date.UTC(year, month, 1))
        }
      }
    },{
      '$group': {
        '_id': { '$ceil': { '$divide': [ { '$dayOfMonth': "$createdAt" }, 7 ] } }, 
        'total': {
          '$sum': '$main.amount'
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'x': '$_id', 
        'y': '$total'
      }
    }
  ]
  const response = await Categorie.aggregate(agg);
  return res.status(200).json({
    response
  })
}