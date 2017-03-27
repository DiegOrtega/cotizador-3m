var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

var http = require('http');
var ejs = require('ejs');
var fs = require('fs');
var pdf = require('html-pdf');

var moment = require('moment');

var multer  =   require('multer');

var fecha = moment().format('DD/MM/YYYY');

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

var graphenedbURL1 = process.env.GRAPHENEDB_COPPER_BOLT_URL;
var graphenedbUser1 = process.env.GRAPHENEDB_COPPER_BOLT_USER;
var graphenedbPass1 = process.env.GRAPHENEDB_COPPER_BOLT_PASSWORD;

//Protocolo de conexión para servidor cloud heroku

if(graphenedbURL == undefined){
	var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'Sistemas'));
	var session = driver.session();
	
	session
	.run('MATCH (n:VENDEDOR) RETURN n')
	.then(function(res){
		res.records.forEach(function(record){
			vendedorArray.push({
			id: record._fields[0].properties.ID,	
			nombre: record._fields[0].properties.NOMBRE,
			extension: record._fields[0].properties.EXTENSION,
			correo: record._fields[0].properties.CORREO,
			folio: record._fields[0].properties.FOLIO	
			});
		});
		console.log("vendedorArray: ");
		console.log(vendedorArray);
	})
	.catch(function(err){
		console.log(err);
	});
	
}else{
	var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
	var driver1 = neo4j.driver(graphenedbURL1, neo4j.auth.basic(graphenedbUser1, graphenedbPass1));
	var session = driver.session();
	var session1 = driver1.session();
	
	session1
	.run('MATCH (n:VENDEDOR) RETURN n')
	.then(function(res){
		res.records.forEach(function(record){
			vendedorArray.push({
			id: record._fields[0].properties.ID,	
			nombre: record._fields[0].properties.NOMBRE,
			extension: record._fields[0].properties.EXTENSION,
			correo: record._fields[0].properties.CORREO,
			folio: record._fields[0].properties.FOLIO	
			});
		});
		console.log("vendedorArray: ");
		console.log(vendedorArray);
	})
	.catch(function(err){
		console.log(err);
	});
	
};

var total_nodos, nombre = null, empresa, telefono, mail, productoArray = [], productoArray2 = [], vendedor = null, num_vendedor, num_cot, descuento, extension, email_vendedor, tiempo_entrega, check, tipo_cambio=20, precio, stock_num, modelo, desc, nombre_p, stock_c, modelo_c, color_grano_c, tiempo_c, precio_c, medida_c, unidad_c, unidad_c, vendedorArray = [],  dir = [], ref=[], indexref = 0;

app.get('/', function(request, response){
	response.render('pages/index3')
});

app.get('/3m', function(req, res) {
	session
		.run('MATCH (n) RETURN count(n) LIMIT 1')
		.then(function(result){
        
			  	result.records.forEach(function(record){
				total_nodos = record._fields[[0]].low; 
				}); 
				
				res.render('pages/3m', {
					desplegar: total_nodos,
					nombre: nombre,
					empresa: empresa,
					telefono: telefono,
					mail: mail,
					productos: productoArray,
					prod_agregados: productoArray2,
					vendedor: vendedor,
					num_vendedor: num_vendedor,
					num_cot: num_cot,
					extension: extension,
					email_vendedor: email_vendedor,
					tiempo_entrega: tiempo_entrega,
					tipo_cambio: tipo_cambio,
					fecha: fecha, 
					precio: precio,
					stock_num: stock_num,
					desc: desc,
					modelo: modelo,
					vendedorArray: vendedorArray,
					dir: dir,
                    indexref: indexref 
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
				productos: productoArray,
				prod_agregados: productoArray2,
				vendedor: vendedor,
				num_vendedor: num_vendedor,
				num_cot: num_cot,
				extension: extension,
				email_vendedor: email_vendedor,
				tiempo_entrega: tiempo_entrega,
				tipo_cambio: tipo_cambio,
				fecha: fecha, 
				precio: precio,
				stock_num: stock_num,
				desc: desc,
				modelo: modelo,
				vendedorArray: vendedorArray,
				dir: dir,
                indexref: indexref
		});
});


app.post('/busqueda/add', function(req, res){
	var stock_num = req.body.stock;
	var desc = req.body.desc;
	var modelo = req.body.modelo;
	var color_grano = req.body.color_grano;
	var medida = req.body.medida;
	var area = req.body.area;
	var division = req.body.division;
	var familia = req.body.familia;
	
	if(stock_num == ''){stock_num = null};
	if(desc == ''){desc = null};
	if(modelo == ''){modelo = null};
	if(color_grano == ''){color_grano = null};
	if(medida == ''){medida = null};
	if(area == ''){area = null};
	if(division == ''){division = null};
	if(familia == ''){familia = null};
	
	console.log(stock_num +" "+ desc+" "+modelo+" "+color_grano+" "+medida);
	
	session
		.run("MATCH (n) WHERE n.STOCK =~ {stock_1} OR n.AREA =~ {area} OR n.COLOR_GRANO =~ {color_grano} OR n.AIL_CODIGO_SAE =~ {key} OR n.CORMA_CODIGO_SAE =~{key} OR n.DESCRIPCION_AMPLIA1 =~{key} OR n.DESCRIPCION_AMPLIA2 =~{key} OR n.DESCRIPCION_AMPLIA3 =~{key} OR n.DESCUENTO =~{key} OR n.DIVISION =~{division} OR n.FAMILIA =~{familia} OR n.MODELO =~ {modelo} OR n.NOMBRE =~{key} OR n.PIEZAS_CAJA =~{key} OR n.STOCK2 =~ {stock_1} OR n.UPC =~ {key} OR n.PRESENTACION_MEDIDA  =~ {medida} RETURN n LIMIT 10", {stock_1: ".*"+stock_num+".*", key: ".*(?i)"+desc+".*", modelo:".*(?i)"+modelo+".*", color_grano:".*(?i)"+color_grano+".*", medida:".*(?i)"+medida+".*", area:".*(?i)"+area+".*", division:".*(?i)"+division+".*", familia:".*(?i)"+familia+".*"  })
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
					venta_caja: record._fields[0].properties.VENTA_CAJA,
					cantidad: 1,
				});	
			});
		    console.log("tamaño de respuesta de busqueda = " + productoArray.length);
		
			res.render('pages/3m', {
				desplegar: total_nodos,
				nombre: nombre,
				empresa: empresa,
				telefono: telefono,
				mail: mail,
				productos: productoArray,
				prod_agregados: productoArray2,
				vendedor: vendedor,
				num_vendedor: num_vendedor,
				num_cot: num_cot,
				extension: extension,
				email_vendedor: email_vendedor,
				tiempo_entrega: tiempo_entrega,
				tipo_cambio: tipo_cambio,
				fecha: fecha, 
				precio: precio,
				stock_num: stock_num,
				desc: desc,
				modelo: modelo,
				vendedorArray: vendedorArray,
				dir: dir,
                indexref: indexref 
			});
		
			productoArray = [];
		
		 console.log("tamaño de respuesta de busqueda = " + productoArray.length);
		
		
		})
		.catch(function(err){
		console.log(err);
		})
});

app.post('/carrito/add', function(req, res){
	var carrito = req.body.agregar;
	
	if(check == carrito){
		productoArray2.splice(productoArray2.length - 1, 1);
	};
	
	check = carrito;
	
	session	
		.run("MATCH (n {STOCK: {carrito}}) RETURN n LIMIT 1 ", {carrito: carrito})
		.then(function(result3){
		result3.records.forEach(function(record){
				productoArray2.push({
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
					venta_caja: record._fields[0].properties.VENTA_CAJA,
					cantidad: 1,
					precio_descuento: null,
					precio_cantidad: null,
					mxn_ref: null
				});	
			});
		
		productoArray2.forEach(function(producto2, index){
			if(producto2.precio_lista_unidad_mxn != undefined){
				producto2.mxn_ref = producto2.precio_lista_unidad_mxn;
				console.log('mxn_ref: ' + producto2.mxn_ref);
			}else{
				console.log("mxn_ref: " + producto2.mxn_ref);
			};
            
            if (ref[index] != 1 ){
                var dir_min = 'http://www.ail.com.mx/imgprod/'+producto2.id_db+'-'+producto2.modelo+'.jpg';
                dir[index] = dir_min.toLowerCase().replace(/\s+/g, '');  
            }else if(ref[index] == 1 ){
                dir[index] = '/img/uploads/'+indexref+'.jpg';
            }
            
            
		});
		
		console.log("productos dentro de carrito = " + productoArray2.length);
		
		 
		
		res.render('pages/3m', {
				desplegar: total_nodos,
				nombre: nombre,
				empresa: empresa,
				telefono: telefono,
				mail: mail,
				productos: productoArray,
				prod_agregados: productoArray2,
				vendedor: vendedor,
				num_vendedor: num_vendedor,
				num_cot: num_cot,
				extension: extension,
				email_vendedor: email_vendedor,
				tiempo_entrega: tiempo_entrega,
				tipo_cambio: tipo_cambio,
				fecha: fecha, 
				precio: precio,
				stock_num: stock_num,
				desc: desc,
				modelo: modelo,
				vendedorArray: vendedorArray,
				dir: dir,
                indexref: indexref
		});
       
		
		})
		.catch(function(err){
		console.log(err);
		})
});

app.post('/eliminacion/add', function(req, res){
	var eliminar = req.body.eliminar;
	//console.log(productoArray2[0].id);
	//console.log("eliminar = " + eliminar);
	console.log(productoArray2.length);
	
	var i = 0;
	
	while(i < productoArray2.length){
		if(productoArray2[i].id == eliminar){
			productoArray2.splice(i, 1);
		};
		console.log(i);
		i++;
	};
	
	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref
		});
});

app.post('/datos/add', function(req, res){
	index = req.body.index;
	tiempo_entrega = req.body.tiempo_entrega;
	
	/*
	vendedor = req.body.vendedor;
	num_vendedor = req.body.num_vendedor;
	num_cot = req.body.num_cot;
	extension = req.body.extension;
	email_vendedor = req.body.email;
	
	console.log("tiempo de entrega: " + tiempo_entrega);
	
	var i = 0;
	
	if(tiempo_entrega != ""){
		while(i < productoArray2.length){
			productoArray2[i].tiempo_entrega = tiempo_entrega;	
			console.log("tiempo: " + productoArray2.tiempo_entrega );
			i++;
		}
	};
	*/
	
	vendedorArray.forEach(function(vendedores, indexRef){
		if(index == indexRef){
			vendedor = vendedores.nombre;
			num_vendedor = vendedores.id;
			num_cot = vendedores.folio;
			extension = vendedores.extension;
			email_vendedor = vendedores.correo;
		};
	});
	
	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref 
		});
});

var html = fs.readFileSync(__dirname + '/views/pages/cotizacion.ejs', 'utf8');


console.log('file://'+ __dirname + '/public');

app.post('/download', function(req, res){
	
	var options = { 
    	height: "16in",        // allowed units: mm, cm, in, px 
  		width: "16in",	
		base: 'file:///Users/DiegOrtega/Desktop/cotizador/cotizador-3m/public',
	};
	
	var obj = {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref 
		};
	
	var renderedhtml = ejs.render(html, obj);
    
    pdf.create(renderedhtml, options).toFile('./cotizacion.pdf', function(err, response) {
  		if (err) return console.log(err);
  		console.log(response); 
        res.download('./cotizacion.pdf');
	}); 
	
});

app.get('/pdfprevio', function(req, res){
	
		productoArray2.forEach(function(producto2, index){
			
			var mxn = producto2.precio_lista_unidad_mxn;
			var usd = producto2.precio_lista_unidad_usd;
			var desc_ref = producto2.descuento;
			
			if(usd != undefined){
				var n = usd.indexOf('$');
				
				console.log("mxn: " + mxn);
				console.log("usd: " + usd);
				console.log('$:' + n);

				if(producto2.mxn_ref != undefined){ 
					
					var m = mxn.indexOf('$');

					console.log("precio: " + mxn);
					
					mxn = mxn.substring(m+1, mxn.length );
					
					var desc_ref2 = parseFloat(desc_ref);
					
					console.log("desc_ref2: " + desc_ref2); 
					
					var diferencia = (parseFloat(mxn)*((desc_ref2)/100));
					
					console.log("diferencia:"+ diferencia);
					
					console.log("mxn: " + mxn);
					
					producto2.precio_descuento = (mxn - diferencia).toFixed(2);
					
					console.log("precio c/ descuento: " + producto2.precio_descuento);
					
					console.log("cantidad: " + producto2.cantidad);
					
					var cantidad_num = parseFloat(producto2.cantidad);
					
					producto2.precio_cantidad = ((mxn - diferencia)*cantidad_num).toFixed(2);

			 	}else if(n != -1 && producto2.mxn_ref == undefined){

					var usd2 = usd.substring(n+1, usd.length);
					
					console.log("transf = " + usd2);
					
					var cambio_usd = parseFloat(usd2);
					
					producto2.precio_lista_unidad_mxn = (cambio_usd*tipo_cambio).toFixed(2);
					
					var precio_mxn = cambio_usd*tipo_cambio;
					
					var desc_ref2 = parseFloat(desc_ref);
					
					console.log("desc_ref2: " + desc_ref2); 
					
					var diferencia = (precio_mxn*((desc_ref2)/100));
					
					console.log("diferencia:"+ diferencia);
					
					producto2.precio_descuento = (precio_mxn - diferencia).toFixed(2); 
					
					console.log("cantidad: " + producto2.cantidad);
					
					var cantidad_num = parseFloat(producto2.cantidad);
					
					producto2.precio_cantidad = producto2.precio_descuento*cantidad_num;
					
					var tipo_cambio_ref = tipo_cambio;

				 };	
			};
             
            console.log('dir['+ index +']:' + dir[index]);
            if(ref[index] != 1 ){
                var dir_min = 'http://www.ail.com.mx/imgprod/'+producto2.id_db+'-'+producto2.modelo+'.jpg';
                dir[index] = dir_min.toLowerCase().replace(/\s+/g, '');
            }else if(ref[index] == 1){
                dir[index] = '/img/uploads/'+indexref+'.jpg';
            }; 
            console.log('dir['+ index +']:' + dir[index]);
				 
		});
	
   res.render('pages/cotizacion',{
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref 
   }); 
});

app.post('/tipo_cambio/add', function(req, res){
	tipo_cambio = req.body.tipo_cambio;
	
	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref
		});
	
});

app.post('/cantidad/add', function(req, res){
	
	cantidad = req.body.cantidad;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			producto2.cantidad = cantidad;
		}
	});

	
	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref 
		});
	
});

app.post('/descuento/add', function(req, res){
	
	descuento = req.body.descuento;
	var index = req.body.index;
	
	console.log("index: " + index);
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("descuento: " + descuento);
			producto2.descuento = descuento;
		}
	});
	
	descuento = 0;
	
	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref 
		});
	
});

app.post('/cambio_nombre/add', function(req,res){
	var nombre_p = req.body.nombre;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("nombre_p: " + nombre_p);
			producto2.nombre = nombre_p;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref
	});
	
});

app.post('/cambio_stock/add', function(req,res){
	var stock_c = req.body.stock;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("stock_c: " + stock_c);
			producto2.stock = stock_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref
	});
	
});

app.post('/cambio_modelo/add', function(req,res){
	var modelo_c = req.body.modelo;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("modelo_c: " + modelo_c);
			producto2.modelo = modelo_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref
	});
	
});

app.post('/cambio_tiempo/add', function(req,res){
	var tiempo_c = req.body.tiempo;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("tiempo_c: " + tiempo_c);
			producto2.tiempo_entrega = tiempo_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref
	});
	
});

app.post('/cambio_color_grano/add', function(req,res){
	var color_grano_c = req.body.color_grano;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("color_grano_c: " + color_grano_c);
			producto2.color_grano = color_grano_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref 
	});
	
});

app.post('/cambio_precio_usd/add', function(req,res){
	var precio_c = req.body.precio;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2,i){
			var mxn = producto2.precio_lista_unidad_mxn;
			var usd = producto2.precio_lista_unidad_usd;
			var desc_ref = producto2.descuento;	
		
		
			if(index == i){	
				console.log("i: " + i );
				console.log("precio_c: " + precio_c);
				usd = precio_c;
				producto2.precio_lista_unidad_usd = usd;
			};
		
			if(usd != undefined){
				var n = usd.indexOf('$');
				
				console.log("mxn: " + mxn);
				console.log("usd: " + usd);
				console.log('$:' + n);

				if(producto2.mxn_ref != undefined){ 
					
					var m = mxn.indexOf('$');

					console.log("precio: " + mxn);
					
					mxn = mxn.substring(m+1, mxn.length );
					
					var desc_ref2 = parseFloat(desc_ref);
					
					console.log("desc_ref2: " + desc_ref2); 
					
					var diferencia = (parseFloat(mxn)*((desc_ref2)/100));
					
					console.log("diferencia:"+ diferencia);
					
					console.log("mxn: " + mxn);
					
					producto2.precio_descuento = (mxn - diferencia).toFixed(2);
					
					console.log("precio c/ descuento: " + producto2.precio_descuento);
					
					console.log("cantidad: " + producto2.cantidad);
					
					var cantidad_num = parseFloat(producto2.cantidad);
					
					producto2.precio_cantidad = ((mxn - diferencia)*cantidad_num).toFixed(2);

			 	}else if(n != -1 && producto2.mxn_ref == undefined){

					var usd2 = usd.substring(n+1, usd.length);
					
					console.log("transf = " + usd2);
					
					var cambio_usd = parseFloat(usd2);
					
					producto2.precio_lista_unidad_mxn = (cambio_usd*tipo_cambio).toFixed(2);
					
					var precio_mxn = cambio_usd*tipo_cambio;
					
					var desc_ref2 = parseFloat(desc_ref);
					
					console.log("desc_ref2: " + desc_ref2); 
					
					var diferencia = (precio_mxn*((desc_ref2)/100));
					
					console.log("diferencia:"+ diferencia);
					
					producto2.precio_descuento = (precio_mxn - diferencia).toFixed(2); 
					
					console.log("cantidad: " + producto2.cantidad);
					
					var cantidad_num = parseFloat(producto2.cantidad);
					
					producto2.precio_cantidad = producto2.precio_descuento*cantidad_num;
					
					var tipo_cambio_ref = tipo_cambio;

				 }else{
					 
					 console.log("transf = " + usd);
					
					var cambio_usd = parseFloat(usd);
					
					producto2.precio_lista_unidad_mxn = (cambio_usd*tipo_cambio).toFixed(2);
					
					var precio_mxn = cambio_usd*tipo_cambio;
					
					var desc_ref2 = parseFloat(desc_ref);
					
					console.log("desc_ref2: " + desc_ref2); 
					
					var diferencia = (precio_mxn*((desc_ref2)/100));
					
					console.log("diferencia:"+ diferencia);
					
					producto2.precio_descuento = (precio_mxn - diferencia).toFixed(2); 
					
					console.log("cantidad: " + producto2.cantidad);
					
					var cantidad_num = parseFloat(producto2.cantidad);
					
					producto2.precio_cantidad = producto2.precio_descuento*cantidad_num;
					
					var tipo_cambio_ref = tipo_cambio;
					 
				 };	
			}
				 
		});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref 
	});
	
});

app.post('/cambio_medida/add', function(req,res){
	var medida_c = req.body.medida;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("medida_c: " + medida_c);
			producto2.presentacion_medida = medida_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref 
	});
	
});

app.post('/cambio_unidad/add', function(req,res){
	var unidad_c = req.body.unidad;
	var index = req.body.index;
	
	productoArray2.forEach(function(producto2, i){
		if(index == i){	
			console.log("i: " + i );
			console.log("unidad_c: " + unidad_c);
			producto2.unidad_medida = unidad_c;
		}
	});
	
	res.render('pages/3m', {
		desplegar: total_nodos,
		nombre: nombre,
		empresa: empresa,
		telefono: telefono,
		mail: mail,
		productos: productoArray,
		prod_agregados: productoArray2,
		vendedor: vendedor,
		num_vendedor: num_vendedor,
		num_cot: num_cot,
		extension: extension,
		email_vendedor: email_vendedor,
		tiempo_entrega: tiempo_entrega,
		tipo_cambio: tipo_cambio,
		fecha: fecha, 
		precio: precio,
		stock_num: stock_num,
		desc: desc,
		modelo: modelo,
		vendedorArray: vendedorArray,
		dir: dir,
        indexref: indexref
	});
	
});

//Image upload

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img/uploads');
  },
  filename: function (req, file, callback) {  
    callback(null, file.originalname + '.jpg')
    indexref = file.originalname;
  }
});

console.log('indexref: ' + indexref)
var upload = multer({ storage : storage}).single('producto');

app.post('/api/photo', function(req,res){

    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var index = req.body.index;
    
        console.log('index: ' + index);
        
        dir[index] = '/img/uploads/'+indexref+'.jpg';
        ref[index] = 1;
        console.log('dir[index]: ' +  dir[index]);
        console.log('dir: ' +  dir);
    
        	res.render('pages/3m', {
			desplegar: total_nodos,
			nombre: nombre,
			empresa: empresa,
			telefono: telefono,
			mail: mail,
			productos: productoArray,
			prod_agregados: productoArray2,
			vendedor: vendedor,
			num_vendedor: num_vendedor,
			num_cot: num_cot,
			extension: extension,
			email_vendedor: email_vendedor,
			tiempo_entrega: tiempo_entrega,
			tipo_cambio: tipo_cambio,
			fecha: fecha, 
			precio: precio,
			stock_num: stock_num,
			desc: desc,
			modelo: modelo,
			vendedorArray: vendedorArray,
			dir: dir,
            indexref: indexref    
	});
    });
});

//Otras cotizadores

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
