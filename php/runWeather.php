<?php
include_once 'static.php';

$URL = "http://api.openweathermap.org/data/2.5/weather?q=Tokyo,JP&units=metric&appid=1502c0d44d5982dcefc4b4f6c87a921b";
$json = file_get_contents( $URL );
$json = mb_convert_encoding( $json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN' );

$link = mysqli_connect(DB_URL,DB_USER,DB_PASS,DB_USER);
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}

$result = mysqli_query($link,'UPDATE '.DB_NAME.' SET data='.quote_smart($link,$json).' where id = 1');
mysqli_close($link);


function quote_smart($link,$value)
{
	// 数値以外をクオートする
	if (!is_numeric($value)) {
		$value = "'" . mysqli_real_escape_string($link,$value) . "'";
	}
	return $value;
}
