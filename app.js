require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const md5 = require("md5");

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname+'public'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model('user', userSchema);

app.get("/", (req, res)=>{
    res.render('home')
});
app.get("/login", (req, res)=>{
    res.render('login')
});
app.get("/register", (req, res)=>{
    res.render('register')
});
app.post("/register",(req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save((err)=>{
        if(!err){
            console.log("User created succesfully!.")
            res.render('secrets')
        }else{
            console.log(err);
        }
    })
});
app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email : username}, (err, foundUser)=>{
        if(foundUser){
            if(foundUser.password === password){
                res.render('secrets');
            }
        }
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000.")
})