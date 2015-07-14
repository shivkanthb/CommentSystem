var express = require('express');
var Comment = require('./models/Comment');
var app = express();
var path = require('path');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/commentSystem');

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html', cons.swig);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req,res){
	res.render('index.html');
});

app.get('/api/comments', function(req,res){
	Comment.find({}, function(err,comments){
		res.json(comments);

	});

});

app.post('/api/comments', function(req,res){
	var commentBody = req.body.commentBody;
	var commentBy = req.body.commentBy;
	var createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

	var comment = new Comment();
	comment.commentBody = commentBody;
	comment.commentBy = commentBy;
	comment.createdAt = createdAt;
	comment.save(function(err){
		res.json({message:"Comment saved successfully"}); 
	});
});

app.listen(port);
console.log("server running on port"+port);