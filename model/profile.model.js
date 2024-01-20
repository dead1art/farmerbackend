const mongoose = require("mongoose")
const validator = require('validator');

const { isEmail } = validator;

var profileSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [isEmail, 'invalid email'],
        required: [true, 'email is required'],
      },
      name: {
        type: String,
      },
      photo: {
        type: Object,
        default:
          'https://scontent-atl3-1.cdninstagram.com/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=scontent-atl3-1.cdninstagram.com&_nc_ohc=MVEG8QTyVK4AX-E1QAd&oh=a2338939f84d05cff0d598c29ce23a6a&oe=5FB5D50F&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2',
      },
})

const Profile = mongoose.model('Profile',profileSchema)

module.exports = Profile;