//app.js
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var mysql = require('mysql')
var myConnection = require('express-myConnection')
var exphbs = require('express-handlebars')
var fileUpload = require('express-fileupload')
var config = require('./config')

//Database
var dbOptions = {
	host: config.database.host,
	user: config.database.user,
	password:config.database.password,
	port: config.database.port,
	database:config.database.db
}

//Router
var indexRouter = require('./routes/index')
var webRouter = require('./routes/web')
var mobRouter = require('./routes/upload')

//express
var app = express()

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//add support tool
app.use(fileUpload())
app.use(express.static('upload'))
app.use(logger('dev'))
app.use(myConnection(mysql,dbOptions, 'pool'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname + '/views')))
var expressValidator = require('express-validator')
app.use(expressValidator())
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true }))
app.use(bodyParser.json())

var methodOverride = require('method-override')
app.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	// look in urlencoded POST bodies and delete it
	var method = req.body._method
	delete req.body._method
	return method
}
}))

var flash = require('express-flash')
var cookieParser = require('cookie-parser')
var session = require('express-session')
app.use(cookieParser('keyboard cat'))
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))

//Router set
app.use(flash())
app.use('/', indexRouter)
app.use('/upload', mobRouter)
app.use('/web', webRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next){
// set locals, only providing error in development
	res.locals.messages = err.messages;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
	res.status(err.status || 500);
	res.render('error');
});

//Log display
app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})

module.exports = app;