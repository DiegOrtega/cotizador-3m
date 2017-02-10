<?php
	require('html_table.php');
	
	$pdf=new PDF();
	$pdf->AddPage();
	$pdf->SetFont('Arial','',12);
	
	$html='
	<head>
			<link href="../../css/pdfstyle.css" rel="stylesheet" type="text/css"/>
			<META http-equiv="Pragma" content="no-cache">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
	<table border="1"d id="tablita">
	<tr>
	<td width="200" height="30">cell 1</td><td width="200" height="30" bgcolor="#D0D0FF">cell 2</td>
	</tr>
	<tr>
	<td width="200" height="30">cell 3</td><td width="200" height="30">cell 4</td>
	</tr>
	</table>';
	$pdf->WriteHTML($html);
	$pdf->Output();
?>
