<?php
include_once 'function.php';

$matches = checkDomain();
if($matches) {
	$url  = "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010";
	$json = file_get_contents( $url );
	$json = mb_convert_encoding( $json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN' );
	echo $json;
} else {
	header("HTTP/1.0 404 Not Found");
}
