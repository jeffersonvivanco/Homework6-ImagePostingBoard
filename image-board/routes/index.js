
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var ImagePost = mongoose.model('ImagePost');


//Stuff needed to user authenticate
var passport = require('passport');
var User = mongoose.model('User');


/* GET out of the box express welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '480Chan - Image Board!' });
});



//-----------------------------------Image posts and adding posts----------------------------------------------------//

router.get('/image-posts/:username', function (req, res) {
  User.findOne({username:req.params.username}).populate('imageposts').exec(function(err,user){
    res.render('image-posts', {'imageposts': user.imageposts, 'username':req.params.username});
  });
});
router.get('/image-posts',function (req, res) {
  res.redirect('/');
});
router.post('/adding-imagepost',function (req, res, next) {

  var imagepost = new ImagePost({
    title : req.body.title,
    user:req.user._id,
    username : user.username
  });
  for(var n=1; n<=3; n++){
    var caption = req.body['image'+n+'Caption'];
    var url = req.body['image'+n+'URL'];
    var image = new Image({
      caption : caption,
      url : url
    });
    if(image.url !== ""){
      imagepost.images.push(image);
    }
  }

  imagepost.save(function (err, savedPost, count) {
    req.user.imageposts.push(savedPost);
    req.user.save(function (err, savedUser, count) {
      res.redirect(301,'/image-posts/'+req.user.username);
    });
  });
});
//-----------------------------------------------------------------------------------------------------//

//-----------------------------Image detail post, adding and removing images------------------------------------------//
router.get('/image-post/:slug', function (req, res, next) {
  ImagePost.findOne({slug:req.params.slug}, function (err, imagep, count) {
    res.render('image-post', {'imagepost':imagep,'images':imagep.images});
  });
});
router.post('/add-image/:slug', function (req, res, next) {
  //Find And Update
  ImagePost.findOne({slug : req.params.slug}, function (err, imagep, count) {
    var image = new Image({
      caption : req.body.newCaption,
      url : req.body.newUrl
    });
    imagep.images.push(image);
    imagep.save();
    res.redirect('/image-post/'+req.params.slug);
  });
});
router.post('/remove-image/:slug', function (req, res, next) {
  //Find And Update
  ImagePost.findOne({slug:req.params.slug}, function (err, imagep, count) {
    if(Array.isArray(req.body.checkedImgs)){
      for( imgId in req.body.checkedImgs){
        imagep.images.id(imgId).remove();
      }
    }
    else{
      if(req.body.checkedImgs){
        imagep.images.id(req.body.checkedImgs).remove();
      }
    }
    imagep.save();
    res.redirect('/image-post/'+req.params.slug);
  })
});
//-----------------------------------------------------------------------------------------------------//

//-------------------------------Register, login, logout------------------------------------------------//
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.post('/register',function (req, res, next) {
  User.register(new User({username:req.body.username}),
      req.body.password, function(err, user){
        if (err) {
          console.log("ERROR"+err);
          // NOTE: error? send message back to registration...
          res.render('register',{message:'Your registration information is not valid'});
        } else {
          // NOTE: once you've registered, you should be logged in automatically
          // ...so call authenticate if there's no error
          passport.authenticate('local')(req, res, function() {
            res.redirect('/image-posts/'+user.username);
          });
        }
      });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});
router.post('/login', function (req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
        res.redirect('/image-posts/'+user.username);
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


//-----------------------------------------------------------------------------------------------------//

module.exports = router;
