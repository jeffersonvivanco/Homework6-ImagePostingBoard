require('../db');

var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var ImagePost = mongoose.model('ImagePost');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/image-posts', function (req, res, next) {
  res.render('image-posts');
});

router.post('/adding-imagepost',function (req, res, next) {

  var imagepost = new ImagePost({
    title : req.body.title
  });
  imagepost.save(function (err, ipt, count) {
    // console.log(err);
  });
  var image = new Image({
    caption : req.body['image1Caption'],
    url:req.body['image1URL']
  });
  ImagePost.findOne({title:req.body.title}, function (err, impst, count) {
    console.log(image);
    impst.images.push(image);
    impst.save(function (err, saveImpst, count) {
      //do something
    })
  });
  res.redirect('/image-posts');
  // var image = new Image({
  //   caption : req.body['image1Caption'],
  //   url:req.body['image1URL']
  // });
  // //Finding then updating
  // ImagePost.findOne({slug:req.body.title}, function (err, impst, count) {
  //   impst.images.push(image);
  //   impst.save();
  //   res.redirect('/image-posts');
  // })






});

module.exports = router;
