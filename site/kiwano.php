<?php

/**
 * Adopted from https://developer.linkedin.com/documents/code-samples
 */
require_once ('config/sysconf.php');
require_once (LIB_DIR . DIRECTORY_SEPARATOR . 'linkedin.php');

session_name('linkedin');
session_start();
 
$linkedin = new LinkedInAPI();

if (isset($_GET['error'])) {
	// LinkedIn returned an error
	print $_GET['error'] . ': ' . $_GET['error_description'];
	exit;
} elseif (isset($_GET['code'])) {
	// User authorized your application
	if ((empty($_SESSION['expires_at'])) || (time() > $_SESSION['expires_at'])) {
		if ($_SESSION['state'] == $_GET['state']) {
			// Get token so you can make API calls
			$linkedin->getAccessToken();
		} else {
			// CSRF attack? Or did you mix up your states?
			exit;
		}
	}
} else { 
	if ((empty($_SESSION['expires_at'])) || (time() > $_SESSION['expires_at'])) {
		// Token has expired, clear the state
		$_SESSION = array();
	}
	if (empty($_SESSION['access_token'])) {
		// Start authorization process
		$linkedin->getAuthorizationCode();
		exit;
	}
}

$user = $linkedin->fetch('GET', '/v1/people/~:(id,first-name,last-name,headline,picture-url)');
require_once(APP_DIR . DIRECTORY_SEPARATOR . 'main.php');

/*
// Congratulations! You have a valid token. Now fetch your profile 
$user = $linkedin->fetch('GET', '/v1/people/~:(id,first-name,last-name,headline,picture-url)');
echo ($user); // ->firstName $user->lastName.";

echo "<hr/>";

$connections = $linkedin->fetch('GET', '/v1/people/~/connections:(id,first-name,last-name,headline,picture-url)');
echo ($connections);

echo "<hr/>";
*/

/*
$c2 = $linkedin->fetch('GET', '/v1/people/id=mRHeH3G7EK/connections:(id,first-name,last-name,headline,picture-url)');
echo ($c2);
*/

exit;

