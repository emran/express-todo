// Dependencies
var express   = require('express'),
   path 	  = require('path'),
   bodyParser = require('body-parser'),
   mongoose   = require('mongoose'),
   cookieParser   = require('cookie-parser'),
   expressSession = require('express-session'),
   passport 	  = require('passport'),
   passportLocal  = require('passport-local');

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

app.use(express.static(path.join(__dirname, 'bower_components')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Route
app.use('/todo', require('./routes/todo'));
app.use('/', require('./routes/user'));


// Start Server 
app.listen(3000);
console.log('TODO app is running...');