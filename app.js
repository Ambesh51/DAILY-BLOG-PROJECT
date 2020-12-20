//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const ejs = require("ejs");
const mongoose= require('mongoose');
const _ =require("lodash");


const homeStartingContent = "Here we can mention our important content or Blogs.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//db blogDB
mongoose.connect("mongodb://localhost:27017/blogDB",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
  console.log(`connection to database established`)
}).catch(err=>{
  console.log(`db error ${err.message}`);
  
})

//create schema for posts
const postSchema= new mongoose.Schema({
  title: String,
  content: String
});

const Post= mongoose.model("Post",postSchema);

// let posts = [];



  app.get("/home", function(req, res){

    Post.find({}, function (err, result) {   //before any method of moongoose we use document variable
        //console.log(result);
        res.render("home", {
          startingContent:homeStartingContent,
            posts: result
        });

    });

});







app.get("/about", function(req,res){
  res.render("about",{AboutContent:aboutContent})
});


app.get("/contact", function(req, res){
  res.render("contact",{contactContent:contactContent})
});


app.get("/compose", function(req,res){
 res.render("compose");


});


app.post("/compose", function(req,res){

const post = new Post({
  title:req.body.postTitle,
  content:req.body.postBody
 });
 post.save()

  res.redirect("/home");


});

//this is the first step towqds getting a dynamic website crated
app.get("/post/:PostId", function (req, res) {

  
  // when we are using array

  //for print on console screen of url end ex- post/intro then console print intro
  // console.log(req.params.postName);

  // const requestedTitle = _.lowerCase(req.params.postName);

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if(storedTitle === requestedTitle){
  //     console.log("Match found");
  //      //open post.ejs thats content show on their thats why we make object not working posts:posts
  //     res.render("post",{
  //      title:post.title,
  //      content:post.content
  //       });

  //   }
  // });


  //now using mongoose

  // find by id

  const requestPostId= req.params.PostId;
  console.log('dnd',  req.params.PostId);

  Post.findOne({_id:requestPostId}, function(err, result){
    console.log('result', result)
    res.render("post",{
      title:result.title,
      content:result.content,
      id:result._id
    });
  });




});
app.get("/delete/:Id",(req,res)=>{
    console.log('delete', );
   let id= req.params.Id;
    Post.findByIdAndDelete(id, function (err, docs) { 
      if (err){ 
          console.log(err) 
      } 
      else{ 
          console.log("Deleted : ", docs); 
          res.redirect("/home");
      } 
  }); 
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
