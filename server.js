var express = require('express');
var app = express();
var bodyParser = require('body-parser');
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
	var body = req.body;
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
	var todoId = req.params.id;
	var matchedTodo;
	todos.forEach(function(item){
		if(item.id == todoId){
			matchedTodo = item;
		}
	});
	
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(400).send();
	}
	
});

app.listen(PORT,function(){
	console.log('Server started at PORT : ' + PORT);
});