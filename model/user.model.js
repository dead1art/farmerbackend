const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose")
const validator = require("validator")

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate: validator.isEmail,
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    },
})

//pre hook to hash the password before updating the db
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
  
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// });

//export of User model
const User = mongoose.model('User',userSchema)

module.exports = User;