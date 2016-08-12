// Where your server and express app are being defined:
var express = require('express');
var app = express();
var models = require('./models');
var wikiRouter = require('./routes/wiki');
var userRouter=require('./routes/users')
var swig = require('swig');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
// ... other stuff

app.engine('html', swig.renderFile); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
app.set('views', path.join(__dirname, '/views')); // where to find the views
swig.setDefaults({ cache: false });
// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

// logging middleware
app.use(morgan('dev'));

models.User.sync({force:false})
.then(function () {
    return models.Page.sync({});
})
.then(function () {
	app.use('/wiki', wikiRouter);
	app.use('/users', userRouter);
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);