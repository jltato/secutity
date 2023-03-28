//jshint esversion:6
require  ("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email:String, 
    password:String
}, {versionKey:false});



userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


app.post("/register", function (req, res) {
    const newUser = new User({
        email:req.body.username, 
        password:req.body.password
    });
    newUser.save()
    .then((result)=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    });
})

app.post("/login", function (req, res) {
    User.findOne({email:req.body.username})
    .then((result)=>{
        
        if (result) {
            if (result.password === req.body.password){
                res.render("secrets");
            }else { res.send("<h1> password incorrect</h1>")}
            
        }else{
            res.send("<h1>User incorrect</h1>")
        }
    })
    .catch((err)=>{
        res.send("<h1>" + err + "</h1>");
    })
})




app.listen(3000, function () {
    console.log("Server Started on port 3000");
});