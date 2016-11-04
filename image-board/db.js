/**
 * Created by jeffersonvivanco on 10/30/16.
 */

var mongoose = require('mongoose'),
    URLSlugs = require('mongoose-url-slugs');

//Added to make user authentication
var passportLocalMongoose = require('passport-local-mongoose');


//my schemas goes here
var UserSchema = new mongoose.Schema({
    imageposts : [{type:mongoose.Schema.Types.ObjectId, ref:'ImagePost'}]
});
var Image  = new mongoose.Schema({
    caption : String,//{type: String, required: true},
    url : String //{type: String, required:true}
});

var ImagePost  = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'UserSchema'},
   title : {type: String, unique: true},
    images : [Image]
});


UserSchema.plugin(passportLocalMongoose);


ImagePost.plugin(URLSlugs('title'));


mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);
mongoose.model('User',UserSchema);
mongoose.connect('mongodb://localhost/hw06');