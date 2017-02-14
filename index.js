var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

var app = express(); 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* Conexión con base de datos remota
var graphenedbURL = process.env.GRAPHENEDB_MAROON_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_MAROON_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_MAROON_BOLT_PASSWORD;

//Protocolo de conexión para servidor cloud heroku
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));

*/

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Sistemas'));

var session = driver.session();

var total_nodos;

app.get('/3m', function(request, response) {
	session
		.run('MATCH (n) RETURN count(n) LIMIT 1000')
		.then(function(result){
			  	result.records.forEach(function(record){
			  	console.log(record._fields[[0]].low);
				total_nodos = record._fields[[0]].low; 
				}); 
				response.render('pages/3m',{
					desplegar: total_nodos
				});    
		})
		.catch(function(err){
		console.log(err);
		})	
});

app.get('/', function(request, response){
	response.render('/pages/index3')
});

app.get('/index3', function(request, response) {
  response.render('pages/index3');
});

app.get('/3m', function(request, response) {
  response.render('pages/3m');
});

app.get('/mapei', function(request, response) {
  response.render('pages/mapei');
});

app.get('/sika', function(request, response) {
  response.render('pages/sika');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;

