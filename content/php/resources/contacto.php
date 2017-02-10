<?php
	require_once("conexion.php");
	$nombre=$_POST["nombre"];
	$empresa=$_POST["empresa"];
	$tel=$_POST["tel"];
	$mail=$_POST["mail"];
	$sql = "INSERT INTO clientes (nomcontact, nomempresa, tel, mail) VALUES ('$nombre', '$empresa', '$tel', '$mail')";
	$result = mysql_query($sql);
	header("location: ../3m.php");
	exit();
?>