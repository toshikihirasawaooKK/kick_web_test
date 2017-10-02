<?php
function checkDomain(){
	$header = emu_getallheaders();
	if(empty($header['HOST'])){
		return false;
	} else {
		$http_origin = $header['HOST'];
		preg_match( '/(kick2017\.toysworks\.me|kick2017\-2\.toysworks\.me|www\.kick\.co\.jp|kick\.co\.jp)/', $http_origin, $matches );
		if ( count( $matches ) > 0 ) {
			return $matches;
		} else {
			return false;
		}
	}
}

function emu_getallheaders() {
	foreach($_SERVER as $h=>$v){
		if(ereg('HTTP_(.+)',$h,$hp))
			$headers[$hp[1]]=$v;
	}
	return $headers;
}
