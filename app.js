var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//对请求体进行一个解析
var bodyParse = require('body-parser')
var md5 = require('md5')
var cors = require('cors')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var backendRouter = require('./routes/backend')
var uploadRouter = require('./routes/updatainfo')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var corsOptions = {
  origin: true,
  credentials: true,
  //这一项是为了跨域专门设置的
}

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({
  extended: false
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/backend', backendRouter)
app.use('/upload', uploadRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
