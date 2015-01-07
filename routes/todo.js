var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

require('../models/todo');

var todo = mongoose.model('todo');

router.get('/', function(req, res){
	todo.find(function(err, todos){
		res.render('index', {items:todos});
    });
});

router.post('/add', function(req, res){
	new todo({task: req.body.task}).save(function(err, doc){
			if(err) res.json(err);
			else    res.redirect('/');
	});
});

router.get('/delete/:id', function(req, res){
	todo.remove({_id: req.params.id}, function(err){
		res.redirect('/');			
	});
});

router.post('/update', function(req, res){
	todo.where({_id: req.body.id}).update({status: req.body.status}, function(err, doc){
			if(err) res.json(err);
			else    res.send(200);
	});
});

module.exports = router;
