<?php
/**
 * Adopted from https://developer.linkedin.com/documents/code-samples
 */
require_once ('config/sysconf.php');
require_once (LIB_DIR . DIRECTORY_SEPARATOR . 'linkedin.php');

session_name('linkedin');
session_start();
 
$linkedin = new LinkedInAPI();

if (isset($_GET['logout'])) {
	$_SESSION = array();
	toLandingApp();
} elseif (isset($_SESSION['uid'])) {
	toMainApp();
} elseif (isset($_GET['error'])) { // LinkedIn returned an error
	toLandingApp();
} elseif (isset($_GET['code'])) {
	// User authorized your application
	if ($_SESSION['state'] == $_GET['state']) {
		// Get token so you can make API calls
		$linkedin->getAccessToken();
		$user = json_decode($linkedin->fetch('GET', '/v1/people/~:(id)'));
		$_SESSION['uid'] = $user->id;
		toMainApp();
	} else { // CSRF attack? Or did you mix up your states?
		toLandingApp();
	}
} elseif (isset($_GET['login'])) {
	if ((empty($_SESSION['expires_at'])) || (time() > $_SESSION['expires_at'])) {
		// Token has expired, clear the state
		$_SESSION = array();
	}
	// Start authorization process
	$linkedin->getAuthorizationCode();
} else {
	toLandingApp();
}

function toMainApp() {
	require_once(APP_DIR . DIRECTORY_SEPARATOR . 'main.php');
	exit;
}

function toLandingApp() {
	require_once(APP_DIR . DIRECTORY_SEPARATOR . 'landing.php');
	exit;
}


