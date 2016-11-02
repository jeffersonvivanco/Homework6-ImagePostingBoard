require('../db');

var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var ImagePost = mongoose.model('ImagePost');




/* GET out of the box express welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/image-posts', function (req, res, next) {
  ImagePost.find({}, function (err, imagepost, count) {
    res.render('image-posts', {'imageposts': imagepost, 'images': imagepost.images});
  });
});
router.post('/adding-imagepost',function (req, res, next) {

  var imagepost = new ImagePost({
    title : req.body.title
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
  imagepost.save(function (err, imagep, count) {
    if(err){
      if(err.code === 11000){
        console.log('double!!!');
      }
    }
    res.redirect(301,'/image-posts');
  });
});


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


module.exports = router;
