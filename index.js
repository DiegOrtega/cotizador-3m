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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(express.static(path.join(__dirname, 'public')));


// Conexión con base de datos remota
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

//Protocolo de conexión para servidor cloud heroku
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));



//var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Sistemas'));

var session = driver.session();

var total_nodos, nombre = null, empresa, telefono, mail, productoArray = [];

app.get('/', function(request, response){
	response.render('pages/index3')
});

app.get('/3m', function(request, response) {
	session
		.run('MATCH (n) RETURN count(n) LIMIT 1')
		.then(function(result){
			  	result.records.forEach(function(record){
				total_nodos = record._fields[[0]].low; 
				}); 
				response.render('pages/3m',{
					desplegar: total_nodos,
					nombre: nombre,
					empresa: empresa,
					telefono: telefono,
					mail: mail,
					productos: productoArray
				});
		
		
		})
		.catch(function(err){
		console.log(err);
		})	
});

app.post('/contacto/add', function(req, res){
	nombre = req.body.contacto_nombre;
	empresa = req.body.contacto_empresa;
	telefono = req.body.contacto_tel;
	mail = req.body.contacto_mail;
	
	console.log("nombre: "+nombre+" empresa: "+empresa+" telefono: "+telefono+" mail: "+mail);

		res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray
		});
});


app.post('/busqueda/add', function(req, res){
	var stock_num = req.body.stock;
	var desc = req.body.desc;
	
	if(stock_num == ''){stock_num = null};
	if(desc == ''){desc = null};
	
	console.log(stock_num +" "+ desc);
	
	session
		.run("MATCH (n) WHERE n.STOCK =~ {stock_1} OR n.AREA =~ {key} OR n.COLOR_GRANO =~ {key} OR n.AIL_CODIGO_SAE =~ {key} OR n.CORMA_CODIGO_SAE =~{key} OR n.DESCRIPCION_AMPLIA1 =~{key} OR n.DESCRIPCION_AMPLIA2 =~{key} OR n.DESCRIPCION_AMPLIA3 =~{key} OR n.DESCUENTO =~{key} OR n.DIVISION =~{key} OR n.FAMILIA =~{key} OR n.FAMILIA =~ {key} OR n.MODELO =~ {key} OR n.NOMBRE =~{key} OR n.PIEZAS_CAJA =~{key} OR n.PRESENTACION_MEDIDA  =~ {key} OR n.STOCK2 =~ $stock_1 OR n.UPC =~ {key} RETURN n LIMIT 5", {stock_1: ".*"+stock_num+".*", key: ".*(?i)"+desc+".*" })
		.then(function(result2){
			result2.records.forEach(function(record){
				productoArray.push({
					id: record._fields[0].identity.low,
					ail_codigo_sae: record._fields[0].properties.AIL_CODIGO_SAE,
					area: record._fields[0].properties.AREA,
					color_grano: record._fields[0].properties.COLOR_GRANO,
					corma_codigo_sae: record._fields[0].properties.CORMA_CODIGO_SAE,
					descripcion_amplia1: record._fields[0].properties.DESCRIPCION_AMPLIA1,
					descripcion_amplia2: record._fields[0].properties.DESCRIPCION_AMPLIA2,
					descripcion_amplia3: record._fields[0].properties.DESCRIPCION_AMPLIA3,
					descuento: record._fields[0].properties.DESCUENTO,
					divisa: record._fields[0].properties.DIVISA,
					division: record._fields[0].properties.DIVISION,
					familia: record._fields[0].properties.FAMILIA,
					fotos: record._fields[0].properties.FOTOS,
					fotos2: record._fields[0].properties.FOTOS2,
					id_db: record._fields[0].properties.ID,
					modelo: record._fields[0].properties.MODELO,
					nombre: record._fields[0].properties.NOMBRE,
					pdf: record._fields[0].properties.PDF,
					PDF2: record._fields[0].properties.PDF2,
					piezas_caja: record._fields[0].properties.PIEZAS_CAJA,
					piezas_minimas: record._fields[0].properties.PIEZAS_MINIMAS,
					precio_distribuidor_especial: record._fields[0].properties.PRECIO_DISTRIBUIDOR_ESPECIAL,
					precio_distribuidor_mxn: record._fields[0].properties.PRECIO_DISTRIBUIDOR_MXN,
					precio_distribuidor_usd: record._fields[0].properties.PRECIO_DISTRIBUIDOR_USD,
					precio_lista_unidad_mxn: record._fields[0].properties.PRECIO_LISTA_UNIDAD_MXN,
					precio_lista_unidad_usd: record._fields[0].properties.PRECIO_LISTA_UNIDAD_USD,
					presentacion_medida: record._fields[0].properties.PRESENTACION_MEDIDA,
					promocion: record._fields[0].properties.PROMOCION,
					stock: record._fields[0].properties.STOCK,
					stock2: record._fields[0].properties.STOCK2,
					tiempo_entrega: record._fields[0].properties.TIEMPO_ENTREGA,
					tipo_servicio: record._fields[0].properties.TIPO_SERVICIO,
					unidad_medida: record._fields[0].properties.UNIDAD_MEDIDA,
					upc: record._fields[0].properties.UPC,
					venta_caja: record._fields[0].properties.VENTA_CAJA
				});	
			});
		    console.log(productoArray);
			res.render('pages/3m', {
				desplegar: total_nodos,
				nombre: nombre,
				empresa: empresa,
				telefono: telefono,
				mail: mail,
				productos: productoArray
			});
			productoArray = [];
		
		
		})
		.catch(function(err){
		console.log(err);
		})
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
