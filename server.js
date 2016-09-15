var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
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

app.delete('/todos/:id',function(req, res, next){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id:todoId});
	if(!matchedTodo){
		res.status(400).json({"error":"no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(todos);
	}
});

app.put('/todos/:id',function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos,{id:todoId});
	var body = _.pick(req.body,'description','completed');
	var validAttributes = {};

	if(!matchedTodo){
		return res.status(404).send();
	}
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if(!_.isString(body.description)){
		return res.status(400).send();	
	}
	
	_.extend(matchedTodo,validAttributes);
	res.json(todos);
});

app.post('/todos',function(req, res){
	var body = _.pick(req.body,'description','completed');

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).json(e);
	})
// 	console.log(body);
// 	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
// 		return res.status(400).send();
// 	}
// 	var currId = todos.length;
// 	currId++;
// 	body.id = currId;
// 	todos.push(body); 
// 	res.json(todos);
});

app.get('/todos',function(req, res, next){
	var queryParams = req.query;
	var filteredTodos = todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(todos,{completed:true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos,{completed:false});
	}
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos,function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
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

db.sequelize.sync().then(function(){
	app.listen(PORT,function(){
		console.log('Server started at PORT : ' + PORT);
	});
})