<?php
	require('../../fpdf/fpdf.php');
	include_once("conexion.php");
	$result=mysql_query("SELECT * FROM clientes ORDER BY nomcontact DESC");
	$number_of_products = mysql_num_rows($result);
	
	$i = 0;
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	while($i < $number_of_products)
		{
			$contact = $row["nomcontact"];
			$enterprise =$row["nomempresa"];
			$telephone = $row["tel"];
			$email = $row["mail"];
			$i = $i + 1;
		}
	printf($row["nomcontact"]);
	printf($row["nomempresa"]);
	printf($row["tel"]);
	printf($row["mail"]);
	mysql_close();
?>