var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
function subSeq(str1, str2, m, n) {
  if (m == 0)
    return true;
  if (n == 0)
    return false;
  var i = 0, j = 0;
  while (i < m && j < n) {
    if (str1.charAt(i) == str2.charAt(j)) {
      i++;
    }
    if (str1.length == i) {
      return true;
    }
    j++;
  }
  return false;
}
app.post('/covidTest', function (req, resp) {
  var n;
  n = req.body.num;
  console.log(req.body)
  var response = [];
  for (var i = 0; i < n; i++) {
    var str1 = req.body.str[i];
    var str2 = req.body.str2;
    var res = subSeq(str1, str2, str1.length, str2.length);

    if (res) {
      var obj = {
        [str1]: "POSIIVE"
      }
      response.push(obj)
    }

    else {
      var obj = {
        [str1]: "NEGATIVE"
      }
      response.push(obj)
    }

  }

  resp.json(response);
});

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
