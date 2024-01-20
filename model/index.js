const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.profile = require("./profile.model")
db.categorie = require("./category/category.model")
db.sub = require("./category/subcat.model")
db.expense = require("./category/expenses.model")
db.receipt = require("./receipt.model")
//db.role = require("./role.model");

//db.ROLES = ["user", "admin", "moderator"];

module.exports = db;