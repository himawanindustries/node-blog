const express=require("express");
const request=require("request");
const bodyParser=require("body-parser");
const app=express();

app.listen(3000,function(){
  console.log("Ready on port 3000");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

app.get("/",function(req,res){
  let test="Hello";
  res.render("home",{Test:test});
});
