var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(),
	cookieParser   = require('cookie-parser'),
    expressSession = require('express-session'),
    passport 	   = require('passport'),
    passportLocal  = require('passport-local');


require('../models/user');

var User = mongoose.model('user');

passport.use( new passportLocal.Strategy(function(username, password, done){
	User.findOne({ username: username }, function (err, user) {
		console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/login', function(req, res){	
	if(req.isAuthenticated()){
		res.redirect('/todo');
	}
	res.render('login', { message: req.session.messages });
});
router.post('/login', loginPost);//passport.authenticate('local'), function(req, res){	
// 	res.redirect('/todo');
// });
function loginPost(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      req.session.messages = info.message;
      return res.redirect('/login');
    }
	req.logIn(user, function(err) {
		if (err) {
			req.session.messages = "Error";
			return next(err);
		}

      // set the message
      return res.redirect('/todo');
    });
    
  })(req, res, next);
}

router.get('/logout', function(req, res){
	req.logout();
	req.session.messages = "";
	res.redirect('/login');
});

router.get('/signup', function(req, res){	
	if(req.isAuthenticated()){
		res.redirect('/todo');
	}
	res.render('signup');
});

router.post('/signup', function(req, res){	
	new User({username: req.body.username, password: req.body.password}).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/login');
	});
});


module.exports = router;