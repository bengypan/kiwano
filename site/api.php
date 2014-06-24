<?php
require_once ('config/sysconf.php');
require_once (LIB_DIR . DIRECTORY_SEPARATOR . 'linkedin.php');

session_name('linkedin');
session_start();
 
switch ($_GET['name']) {
	case 'prof' : 
		return getUserProfile();
	case 'conn' : 
		return getConnections();
}

function getUserProfile() {
	$linkedin = new LinkedInAPI();
	$user = $linkedin->fetch('GET', '/v1/people/~:(id,first-name,last-name,headline,picture-url)');
	echo $user;
}

function getConnections() {
	$linkedin = new LinkedInAPI();
	$connections = $linkedin->fetch('GET', '/v1/people/~/connections:(id,first-name,last-name,headline,picture-url)');
	echo $connections;
}

