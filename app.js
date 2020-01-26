//jshint esversion:6

//Declaration
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const app=express();

//Setup
app.listen("3000",function(){
  console.log("Run on Port 3000");
})
app.set("view engine","ejs");

//use module
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//route
app.get("/",function(req,res){
  res.render("index","");
})
