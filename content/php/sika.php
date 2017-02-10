<?php
?>
<html>
	<head>
		<title>Cotizador SIKA&#174;</title>
		<link href="../css/sikastyle.css" rel="stylesheet" type="text/css"/>
		<META http-equiv="Pragma" content="no-cache">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<center>
			<form method="post" action="resources/contacto.php"><!--primer parte //DATOS DE CLIENTE//-->
				<fieldset>
					<legend>Primer paso: INGRESA A TU CONTACTO</legend>
					<p>
						<input type="text" placeholder="&nbsp;Nombre de contacto" size="35">&ensp;
						<input type="text" placeholder="&nbsp;Empresa" size="50">&ensp;
						<input type="text" placeholder="&nbsp;Tel&eacute;fono">&ensp;
						<input type="email" placeholder="&nbsp;E-Mail">
						<input type="submit" value="Ingresar datos">
					</p>
				</fieldset>
			</form><!--Terminan datos de cliente-->
			<form method="post" action="resources/cotizar.php"><!--segunda parte //BUSCADOR-->
				<fieldset>
					<legend>Segundo paso: BUSCA EL PRODUCTO Y AGREGALO A LA COTIZACI&Oacute;N CUANDO TERMINES</legend>
					<p>
						<input type="text" placeholder="&nbsp;Modelo del producto" size="25">&ensp;
						<input type="text" placeholder="&nbsp;Descripci&oacute;n del producto" size="110">
						<br/>
						<div id="cotiza">
							&nbsp;
						</div>
						<br/>
						<input type="button" value="Buscar">&emsp;<input type="submit" value="Agregar todo">
					</p>
				</fieldset>
			</form><!--Termina buscador-->
			<form method="post" action="resources/vendedor.php"><!--Última parte //DATOS DE VENDEDOR Y TIEMPO ENTREGA//-->
				<fieldset>
					<legend>Tercer paso: INGRESA TUS DATOS DE VENDEDOR Y TIEMPO DE ENTREGA</legend>
					<p>
						<input type="text" placeholder="&nbsp;Nombre de vendedor" size="35">&ensp;
						<input type="text" placeholder="&nbsp;No. Vend." size="7">&ensp;
						<input type="text" placeholder="&nbsp;No. Cot." size="7">&ensp;
						<input type="text" placeholder="&nbsp;Descuento" size="8">&ensp;
						<input type="text" placeholder="&nbsp;Extensi&oacute;n" size="10">&ensp;
						<input type="email" placeholder="&nbsp;E-Mail de vendedor">&ensp;
						<input type="text" placeholder="Tiempo de entrega">
						<br/>
						<input type="submit" value="Ingresar datos">
					</p>
				</fieldset>
			</form><!--Terminan datos de vendedor-->
			<form method="post" action="../fpdf/.php"><!--Generador de PDF //TODO LO GUARDADO EN EL VECTOR SE IMPRIME EN EL PDF//-->
				<fieldset>
					<legend>&Uacute;ltimo paso: GENERA Y GUARDA TU PDF</legend>
					<p>
						<input type="submit" value="Crear PDF">
					</p>
				</fieldset>
			</form>
		</center>
	</body>
</html>