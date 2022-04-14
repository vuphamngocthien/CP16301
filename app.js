var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');

const session = require('express-session');
const mongoose = require('mongoose');
require('./compoments/user/model');
require('./compoments/categories/model');
require('./compoments/products/model');

// Khai báo các file roter 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/products');
var apisRoutes = require('./routes/api');
var categorysRoutes = require('./routes/categorys');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'mykey',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false}
}))

app.use(cors());
app.all('/', function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//Đưa đường link vào thay đổi 'Password' với tên 'Database ' {user: admin; password: 123: tên database: Spring202216301}
mongoose.connect('mongodb+srv://admin:123@cluster0.kkah6.mongodb.net/Node?retryWrites=true&w=majority', {  
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
.catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
app.use('/san-pham', usersRouter);
app.use('/api', apisRoutes);
app.use('/san-pham/danh-muc', categorysRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
