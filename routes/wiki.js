var router = require('express').Router();
var models=require("../models");
var Page=models.Page;
var User=models.User;

router.get('/', function(req, res, next) {

  Page.findAll().then(function(pages){
  	res.render('index',{pages:pages});
  });
 
  
});

router.post('/', function(req, res, next) {
	//var params=req.body;

	User.findOrCreate({
		  where: {
		    name: req.body.name,
		    email: req.body.email
		  }
		})
		.then(function (values) {

		  var user = values[0];

		  var page = Page.build({
		    title: req.body.title,
		    content: req.body.content
		  });

		  return page.save().then(function (page) {
		    return page.setAuthor(user);
		  });

		})
		.then(function (page) {
		  res.redirect(page.route);
		})
		.catch(next);

	/*var page=Page.build({
		title:params.title,
		content:params.content
	});

	var user=User.findOrCreate({
		name:params.name,
		email:params.email
	}).then();

	Promise.all([page.save(),user.save()]).then(function(result){
		res.redirect(result[0].route)
		//res.json(result);
	}).catch(next); */
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/:pageName', function(req, res, next) {
	var pageTitle=req.params.pageName;

	var pages=Page.findOne({
		where:{
			urlTitle:pageTitle
		},
		include:[
		{model:User, as:'author'}
		]
	}).then(function(result){
		//res.redirect(result.route);
		if(result==null){
			res.status(404).send();
		}else{
			console.log(result);
			res.render('wikipage',{page:result});
		}
		
	}).catch(next);
  
});



module.exports = router;