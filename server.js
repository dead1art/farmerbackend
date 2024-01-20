const express = require("express")
const cors = require("cors");
const { urlencoded } = require("express");
const { db } = require("./model/index");
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const { DB } = require("./config/db.config");
const cron = require('node-cron');


const app = express();

const corsoption = {
    origin: "http:localhost:8080",
}

require('dotenv').config()
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))


const mongodb_local = 'mongodb://127.0.0.1:27017/farmer'
const mongodb_deployed = process.env.MONGODB_URL

console.log(mongodb_deployed);

mongoose
  .connect(mongodb_deployed, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


require('./routes/auth.routes')(app);
require('./routes/categorie/cat.routes')(app);
require('./routes/categorie/sub.routes')(app);
require('./routes/categorie/expense.routes')(app);
require('./routes/profile.routes')(app);
require('./routes/receipt.routes')(app);


app.get("/",(req,res)=>{
    res.json({"message":"This is a new application for all with new updates"})
})

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});