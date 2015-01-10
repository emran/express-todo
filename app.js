// Dependencies
var express   = require('express'),
   path 	  = require('path'),
   bodyParser = require('body-parser'),
   mongoose   = require('mongoose'),
   fs 		  = require('fs'),
   cookieParser   = require('cookie-parser'),
   expressSession = require('express-session'),
   passport 	  = require('passport'),
   passportLocal  = require('passport-local'),
   loggedinUserData;

// MongoDB
mongoose.connect('mongodb://localhost/todos');

// Express
var app = express();

// Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use(cookieParser);
app.use(expressSession({ 
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// Load Models
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

var User = mongoose.model('user');

passport.use( new passportLocal.Strategy(function(username, password, done){
	User.findOne({ username: username }, function (err, user) {
		console.log(user);
      if (err) { return done(err); }
      if (!user) {
      	req.session.messages = 'Incorrect username.';
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
      	// req.session.messages = 'Incorrect password.';
        return done(null, false, { message: 'Incorrect password.' });
    //    done.redirect('/login');
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

app.use(express.static(path.join(__dirname, 'bower_components')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Route
app.use('/todo', require('./routes/todo'));

app.get('/login', function(req, res){	
	if(req.isAuthenticated()){
		res.redirect('/todo');
	}
	res.render('login', { message: req.session.messages });
});
app.post('/login', passport.authenticate('local'), function(req, res){	
	res.redirect('/todo');
});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
});
app.get('/signup', function(req, res){	
	if(req.isAuthenticated()){
		res.redirect('/todo');
	}
	res.render('signup');
});
app.post('/signup', function(req, res){	
	new User({username: req.body.username, password: req.body.password}).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/login');
	});
});

// Start Server 
app.listen(3000);
console.log('TODO app is running...');