/**
 * Created by jeffersonvivanco on 10/30/16.
 */
var mongoose = require('mongoose'),
    URLSlugs = require('mongoose-url-slugs');

//my schema goes here
var Image  = new mongoose.Schema({
    caption : {type: String, required: true},
    url : {type: String, required:true}
});

var ImagePost  = new mongoose.Schema({
   title : {type: String, required: true},
    images : [Image]
});

ImagePost.plugin(URLSlugs('title'));

mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);
mongoose.connect('mongodb://localhost/hw06');