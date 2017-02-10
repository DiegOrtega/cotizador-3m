<?php
	include_once('conexion.php');
	$stock=$_POST["stock"];
	$desc=$_POST["desc"];
	$sql = "SELECT  FROM inventario (nomcontact, nomempresa, tel, mail) VALUES ('$stock', '$desc')";
	$result = mysql_query($sql);
?>