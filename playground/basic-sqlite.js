var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname + '/basic-sqlite.sqlite'
});

var Todo = sequelize.define('todo',{
	description:{
		type:Sequelize.STRING,
		allowNull: false,
		validate:{
			len:[1,250]
		}
	},
	completed:{
		type:Sequelize.BOOLEAN,
		defaultValue:false
	}
});

sequelize.sync({
	// force:true
}).then(function(){
	console.log('Evrytingh is synced');

	Todo.create({
		description:'Walk the dog',
		completed:false
	}).then(function(todo){
		return Todo.create({
			description: 'Shop groceries',
			completed:true
		});
	}).then(function(){
		// return Todo.findById(2)
		return Todo.findAll({
			where:{
				completed:true
			}
		});
	}).then(function(todos){
		if(todos){
			console.log('Todo Found :' + todos[0].description);
		} else {
			console.log('No Todo Found');
		}
	}).catch(function(e){
		console.log(e);
	});
});