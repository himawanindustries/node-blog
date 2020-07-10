//jshint esversion:6

//Module import
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const ejs=require("ejs");
const app=express();
const _=require("lodash");
const mongoose=require("mongoose");
const cors=require("cors");
// const config=require("/config/auth.config.js");
var jwt=require("jsonwebtoken");
var bcrypt=require("bcryptjs");

//contents
const homeStartingContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non augue a justo vulputate condimentum vitae eu tortor. Nulla facilisi. Duis sed eleifend nulla, ut consequat mi. Mauris hendrerit risus ipsum, non commodo nisl sodales pharetra. Nulla facilisi. Pellentesque efficitur odio augue, at tincidunt lorem dictum sit amet. In dolor diam, iaculis sit amet nisl sit amet, mollis fermentum enim.";
const aboutContent="Morbi porta at ex sagittis eleifend. Maecenas vitae auctor est. Nam vel euismod leo. Sed rutrum dui a massa pretium, nec cursus nunc malesuada. Mauris at dui dapibus, tempor leo eget, tincidunt massa. Nunc iaculis nulla in lacus vehicula, nec rutrum lectus volutpat. Aliquam auctor egestas risus a varius. Phasellus dapibus, elit eget sagittis egestas, sem mauris vulputate est, dictum consectetur dui libero et lorem.";
const contactContent="Quisque purus velit, hendrerit efficitur libero vulputate, luctus euismod est. Vestibulum fermentum nibh eu magna lacinia, a sollicitudin magna placerat. Sed ultricies lectus in tincidunt ullamcorper. Ut in lorem massa. Nulla et ligula a dolor finibus euismod in vel orci. Suspendisse tempus, velit a semper placerat, nisi magna volutpat magna, quis egestas magna ipsum cursus ligula. Suspendisse libero sapien, bibendum sit amet nibh at, commodo posuere sem. Ut vehicula semper condimentum. Curabitur semper vel ex non tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed urna libero, malesuada sit amet diam nec, ornare varius justo. In hac habitasse platea dictumst. Interdum et malesuada fames ac ante ipsum primis in faucibus. In ultricies et est efficitur placerat.";

// let posts=[];

//Setup local webserver
// app.listen("3000",function(){
//   console.log("Run on Port 3000");
// })

//cors
var corsOptions={
  origin:"http://localhost:3001"
}
//setup to heroku port and local
let port= process.env.PORT;
if (port==null||port=="") {
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port "+port);
});

//engine used for view
app.set("view engine","ejs");

//setup mongoose+atlas
mongoose.connect("mongodb+srv://rrow10:Mongodb234@cluster0-ublo5.mongodb.net/blog",{useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify:false});
//create schema + model
const postsSchema={title:String,content:String};
const postModel=mongoose.model("post",postsSchema);
const usersSchema={username:String,password:String,accessToken:String};
const userModel=mongoose.model("user",usersSchema);

//use express module
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

//route
app.get("/",function(req,res){
  // res.render("home",{
  //   ejshomecontent:homeStartingContent,
  //   posts:posts
  // });
  postModel.find({},function(err,posts){
    res.render("home",{
      ejshomecontent:homeStartingContent,
      posts:posts
    });
  });
})

app.get("/about",function(req,res){
  res.render("about",{
    ejsaboutcontent:aboutContent
  })
})

app.get("/contact",function(req,res){
  res.render("contact",{
    ejscontactcontent:contactContent
  })
})

app.get("/compose",function(req,res){
  verifyToken=(req,res,next)=>{
    let tokken=req.headers["x-access-token"];
    if (!token) {
      console.log("No token");
    }

    jwt.verify(token, "123", (err,decoded)=>{
      if (err) {
        console.log("unauthorized");
      }
      res.render("compose",{
      })
    })
  }

})

app.get("/login",function(req,res){
  res.render("login",{
  })
})

//compose
app.post("/compose",function(req,res){
  // const post={
  //   title:req.body.composetitle,
  //   content:req.body.composecontent
  // };
  // posts.push(post);
  const post=new postModel({
      title:req.body.composetitle,
      content:req.body.composecontent
  });
  post.save(function(err){
  if (!err) {
    res.redirect("/");
  }
  });
})

//posts route
app.get("/posts/:postId",function(req,res){
  const requestedPostId=req.params.postId;
  postModel.findOne({_id:requestedPostId},function (err,post){
    res.render("post",{
      ejsposttitle:post.title,
      ejspostcontent:post.content
      });
  });
  // posts.forEach(function(post){
  //   const storedTitle=_.lowerCase(post.title);
  //   if(storedTitle === requestedPage){
  //     console.log("Post Found");
  //     res.render("post",{
  //       ejsposttitle:post.title,
  //       ejspostcontent:post.content
  //       });
  //   }else{
  //     console.log("Post Not found");
  //   };
  // });

})


//Signup
app.get("/signup",function(req,res){
  res.render("signup");
})
app.post("/signup", function(req,res){
  userModel.findOne({username:req.body.usernameinput}).exec((err,user)=>{
    if (err) {
      console.log("Error found "+ message.err);
    }
    if (user) {
      console.log("Username exist");
    }

    const Saveuser=new userModel({
      username:req.body.usernameinput,
      password:bcrypt.hashSync(req.body.passwordinput,6),
      accessToken:""
    });

    Saveuser.save(function(err){
      if (!err) {
        res.redirect("/");
        console.log("New user registered successfully");
      }
    });
  });
})

//login
app.get("/login",function(req,res){
  res.render("login",{
  })
})

app.post("/login",function(req,res){
  userModel.findOne({username:req.body.usernameInput},function (err,user){
    if (!user) {
      console.log("user not found");
      res.redirect("/login");
    }

    var passwordIsValid=bcrypt.compareSync(
      req.body.passwordInput,
      user.password
    );

    if (!passwordIsValid) {
      console.log("Invalid Password");
    }

    var token =jwt.sign({id:user._id},'123',{expiresIn:86400});
  
    userModel.findOneAndUpdate({username:req.body.usernameInput},{accessToken:token},function(req,res){
    console.log("user : "+ usernamelog + " token assigned : "+ token);
    });
    // res.redirect("/compose");
    res.status(200).send({
      id:user._id,
      username:user.username,
      accessToken:token
    });

  })});
