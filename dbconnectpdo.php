<?php
$servername="107.180.1.16";
$username="sprog20221";
$password="sprog20221";
 
try
{
    $conn=new PDO("mysql:host=$servername;dbname=sprog20221",$username,$password);
    $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
    echo '<br>'.$e->getMessage();
}
     
?>
