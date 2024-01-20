const bcrypt = require("bcryptjs/dist/bcrypt")

const comparePassword = async (dbPassword,userPassword)=>{
    return await bcrypt.compare(dbPassword,userPassword)
}

module.exports = comparePassword;