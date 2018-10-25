var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var db = require('./model/db'),
    blob = require('./model/blobs'),
    vacancy = require('./model/vacancy'),
    jobLocation = require('./model/job-location'),
    user = require('./model/user'),
    faculty = require('./model/faculty'),
    studyProgram = require('./model/study-program'),
    memory = require('./model/memory'),
    news = require('./model/news'),
    event = require('./model/event'),
    knowledgeSharingCategory = require('./model/knowledgesharingcategory'),
    knowledgeSharing = require('./model/knowledgesharing'),
    broadcast = require('./model/broadcast');
    

var routes = require('./routes/index'),
    utils = require('./routes/utils'),
    vacancies = require('./routes/vacancies'),
    joblocations = require('./routes/joblocations'),
    users = require('./routes/users'),
    faculties = require('./routes/faculties'),
    studyprograms = require('./routes/studyprograms'),
    memories = require('./routes/memories'),
    newsRoute = require('./routes/news'),
    events = require('./routes/events'),
    knowledgeSharingCategories = require('./routes/knowledgesharingcategories'),
    knowledgeSharings = require('./routes/knowledgesharings'),
    broadcasts = require('./routes/broadcasts');

var knowledgesharingsRewiew = require('./routes/knowledgesharings_review');
    

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '5mb' }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

// app.use(utils.basicAuth('username', 'password'));
app.use('/', routes);
app.use('/vacancies', vacancies);
app.use('/joblocations', joblocations);
app.use('/users', users);
app.use('/faculties', faculties);
app.use('/studyprograms', studyprograms);
app.use('/memories', memories);
app.use('/news', newsRoute);
app.use('/events', events);
app.use('/knowledgesharingcategories', knowledgeSharingCategories);
app.use('/knowledgesharings', knowledgeSharings);
app.use('/broadcasts', broadcasts);
app.use('/review', knowledgesharingsRewiew);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Gak ketemu');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
