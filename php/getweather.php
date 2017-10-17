<?php
include_once 'static.php';
include_once 'function.php';

$matches = checkDomain();
if($matches) {
	$link = mysqli_connect(DB_URL,DB_USER,DB_PASS,DB_USER);
	if (mysqli_connect_errno()) {
		exit();
	}
	$result = mysqli_query($link,'SELECT * FROM '.DB_NAME.' where id = 1');
	$row = mysqli_fetch_assoc($result);
	mysqli_free_result($result);
	mysqli_close($link);
	echo $row["data"];
} else {
	header("HTTP/1.0 404 Not Found");
}
