<?php
	/*require('../../fpdf/fpdf.php');
	include_once("conexion.php");
	$result=mysql_query("SELECT * FROM clientes ORDER BY nomcontact DESC");
	$number_of_products = mysql_num_rows($result);/*mysql_fetch_assoc*/
	
	/*while($row = mysql_fetch_array($result, MYSQL_BOTH))
		{
			$contact = $row["nomcontact"];
			$enterprise =$row["nomempresa"];
			$telephone = $row["tel"];
			$email = $row["mail"];
		}

	mysql_close();
	
	$pdf=new FPDF();
	$pdf->AddPage();
	
	$Y_Fields_Name_position = 20;/*20*/
	/*$Y_Table_Position = 26;/*26*/
	
	/*$pdf->SetFillColor(232,232,232);
	$pdf->SetFont('Arial','B',12);
	$pdf->SetY($Y_Fields_Name_position);
	$pdf->SetX(10);/*45*/
	/*$pdf->Cell(40,6,'NOMBRE',1,0,'C',1);/*20,6*/
	/*$pdf->SetY($Y_Fields_Name_position);
	$pdf->SetX(50);/*65*/
	/*$pdf->Cell(80,6,'EMPRESA',1,0,'C',1);/*100,6*/
	/*$pdf->SetX(130);/*135*/
	/*$pdf->Cell(30,6,'TELEFONO',1,0,'C',1);/*30,6*/
	/*$pdf->SetX(160);
	$pdf->Cell(40,6,'MAIL',1,0,'C',1);/*30,6*/
	/*$pdf->Ln();
	
	$pdf->SetFont('Arial','',12);
	$pdf->SetY($Y_Table_Position);
	$pdf->SetX(10);
	$pdf->MultiCell(40,6,$contact,1,'L');
	$pdf->SetY($Y_Table_Position);
	$pdf->SetX(50);
	$pdf->MultiCell(80,6,$enterprise,1,'L');
	$pdf->SetY($Y_Table_Position);
	$pdf->SetX(130);
	$pdf->MultiCell(30,6,$telephone,1,'L');
	$pdf->SetY($Y_Table_Position);
	$pdf->SetX(160);
	$pdf->MultiCell(40,6,$email,1,'L');
	
	$i = 0;
	$pdf->SetY($Y_Table_Position);
	$pdf->SetX(10);
	while ($i < $number_of_products)
		{
			$pdf->SetX(10);
			$pdf->MultiCell(40,6,$contact,1,'L');
			$pdf->SetX(50);
			$pdf->Cell(80,6,$enterprise,1,'L');
			$pdf->SetX(130);
			$pdf->Cell(30,6,$telephone,1,'L');
			$pdf->SetX(160);
			$pdf->Cell(40,6,$email,1,'L');
			$i = $i +1;
		}
	
	$pdf->Output();*/
require('../../fpdf/fpdf.php');
include("conexion.php");

$pdf=new FPDF();
$pdf->SetAutoPageBreak(false);
$pdf->AddPage();

$y_axis_initial = 25;

$pdf->SetFillColor(232,232,232);
$pdf->SetFont('Arial','B',12);
$pdf->SetY($y_axis_initial);
$pdf->SetX(25);
$pdf->Cell(30,6,'NOMBRE',1,0,'L',1);
$pdf->Cell(100,6,'EMPRESA',1,0,'L',1);
$pdf->Cell(30,6,'TELEFONO',1,0,'R',1);
$pdf->Cell(50,6,'MAIL',1,0,'R',1);

$y_axis_initial = $y_axis_initial + 6;

$result=mysql_query('SELECT nomcontact,nomempresa,tel,mail FROM clientes ORDER BY nomcontact');

$i = 0;

$max = 25;

$row_height = 6;

while($row = mysql_fetch_array($result))
{
    if ($i == $max)
    {
        $pdf->AddPage();

        $pdf->SetY($y_axis_initial);
        $pdf->SetX(25);
        $pdf->Cell(30,6,'NOMBRE',1,0,'L',1);
        $pdf->Cell(100,6,'EMPRESA',1,0,'L',1);
        $pdf->Cell(30,6,'TELEFONO',1,0,'R',1);
		$pdf->Cell(50,6,'MAIL',1,0,'R',1);
        
        $y_axis = $y_axis + $row_height;
        
        $i = 0;
    }

    $nombre = $row['nomcontact'];
    $empresa = $row['nomempresa'];
    $telefono = $row['tel'];
	$imeil = $row['mail'];

    $pdf->SetY($y_axis_initial);
    $pdf->SetX(25);
    $pdf->Cell(30,6,$nombre,1,0,'L',1);
    $pdf->Cell(100,6,$empresa,1,0,'L',1);
    $pdf->Cell(30,6,$telefono,1,0,'R',1);
	$pdf->Cell(50,6,$imeil,1,0,'R',1);

    $y_axis_initial = $y_axis_initial + $row_height;
    $i = $i + 1;
}

mysql_close();
$pdf->Output();
?>
?>