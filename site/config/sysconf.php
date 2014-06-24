<?php

define('API_KEY', 'YOUR_API_KEY');
define('REDIRECT_URI', 'YOUR REDIRECT URI'); // e.g. http://localhost:8080
define('SCOPE', 'r_fullprofile r_emailaddress rw_nus r_network r_contactinfo w_messages');

define('LINKEDIN_AUTHORIZATION_ENDPOINT', 'https://www.linkedin.com/uas/oauth2/authorization');
define('LINKEDIN_ACCESS_TOKEN_ENDPOINT', 'https://www.linkedin.com/uas/oauth2/accessToken');
define('LINKEDIN_API_ENDPOINT', 'https://api.linkedin.com');

define('DOC_ROOT', realpath($_SERVER['DOCUMENT_ROOT']));
define('LIB_DIR', DOC_ROOT . DIRECTORY_SEPARATOR . 'lib');
define('APP_DIR', DOC_ROOT . DIRECTORY_SEPARATOR . 'apps');

?>
