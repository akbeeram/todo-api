var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var PORT = process.env.PORT || 3000;
var todos = [{
	description: 'Going grocery shopping',
	completed: false,
	id: 1
},{
	description: 'Water the plants',
	completed: false,
	id: 2
},{
	description: 'Feed the cat',
	completed: false,
	id: 3
}];

app.use(bodyParser.json());

app.get('/',function(req, res, next){
	res.send('TODO API Root');
	next();
});

app.post('/todos',function(req, res){
	var body = _.pick(req.body,'description','completed');
	console.log(body);
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	var currId = todos.length;
	currId++;
	body.id = currId;
	todos.push(body); 
	res.json(todos);
});

app.get('/todos',function(req, res, next){
	res.json(todos);
});

app.get('/todos/:id',function(req, res, next){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id:todoId});
	
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(400).send();
	}
	
});

app.listen(PORT,function(){
	console.log('Server started at PORT : ' + PORT);
});