// Where your server and express app are being defined:
var express = require('express');
var app = express();
var models = require('./models');
var wikiRouter = require('./routes/wiki');
var swig = require('swig');
// ... other stuff

models.User.sync({})
.then(function () {
    return models.Page.sync({});
})
.then(function () {
	app.use('/wiki', wikiRouter);
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);