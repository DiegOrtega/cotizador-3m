<?php
	mysql_connect("127.0.0.1", "root", "") or die(mysql_error());
	mysql_select_db("cotizador") or die(mysql_error());
	@mysql_query("SET NAMES 'utf8'");
?>