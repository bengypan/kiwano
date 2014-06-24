<?php

class LinkedInAPI {

	public function getAuthorizationCode() {
		$params = array('response_type' => 'code',
			'client_id' => API_KEY,
			'scope' => SCOPE,
			'state' => uniqid('', true), // unique long string
			'redirect_uri' => REDIRECT_URI,
		);
	
		// Authentication request
		$url = LINKEDIN_AUTHORIZATION_ENDPOINT . '?' . http_build_query($params);
	
		// Needed to identify request when it returns to us
		$_SESSION['state'] = $params['state'];
	
		// Redirect user to authenticate
		header("Location: $url");
	}

	public function getAccessToken() {
		$params = array(
			'grant_type' => 'authorization_code',
			'client_id' => API_KEY,
			'client_secret' => API_SECRET,
			'code' => $_GET['code'],
			'redirect_uri' => REDIRECT_URI,
		);
	
		// Access Token request
		$url = LINKEDIN_ACCESS_TOKEN_ENDPOINT . '?' . http_build_query($params);
	
		// Tell streams to make a POST request
		$context = stream_context_create(
			array('http' => array('method' => 'POST'))
		);
	
		// Retrieve access token information
		$response = file_get_contents($url, false, $context);
	
		$token = json_decode($response);
	
		// Store access token and expiration time
		$_SESSION['access_token'] = $token->access_token; // guard this! 
		$_SESSION['expires_in'] = $token->expires_in; // relative time (in seconds)
		$_SESSION['expires_at'] = time() + $_SESSION['expires_in']; // absolute time

		return true;
	}
	
	public function fetch($method, $resource, $body = '') {
		$params = array('oauth2_access_token' => $_SESSION['access_token'], 'format' => 'json');
	
		// Need to use HTTPS
		$url = LINKEDIN_API_ENDPOINT . $resource . '?' . http_build_query($params);
		// Tell streams to make a (GET, POST, PUT, or DELETE) request
		$context = stream_context_create(
			array('http' => array('method' => $method))
		);
	
		// Hocus Pocus
		$response = file_get_contents($url, false, $context);

		return $response;
	}
};
