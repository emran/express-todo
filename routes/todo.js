var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

require('../models/todo');
require('../models/user');

var todo = mongoose.model('todo');
function isAuthenticated(req, res, next) {
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated())
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}

router.get('/', isAuthenticated, function(req, res){
	console.log(req.session.passport.user);
	var User = mongoose.model('user'), userData;
	User.find({ _id: req.session.passport.user}, function(err, user){
		console.log(user);
		userData = user; return true;
	}).limit(1);
	console.log(userData);
	todo.find({user: req.session.passport.user}, function(err, todos){
		res.render('index', {items:todos, userData:userData});
	});	
});

router.post('/add', function(req, res){
	new todo({task: req.body.task, user: req.session.passport.user}).save(function(err, doc){
			if(err) res.json(err);
			else    res.redirect('/todo');
	});
});

router.get('/delete/:id', function(req, res){
	todo.remove({_id: req.params.id}, function(err){
		res.redirect('/todo');			
	});
});

router.post('/update', function(req, res){
	todo.where({_id: req.body.id}).update({status: req.body.status}, function(err, doc){
			if(err) res.json(err);
			else    res.send(200);
	});
});

module.exports = router;
