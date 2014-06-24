# Kiwano
Kiwano is a pet project to demonstrate how to build a mobile app using ionic framework.  The mobile app does the following:
- User logs into the app using their LinkedIn user/password
- User can ask questions to people in their networks
- As user types the question, the app should parse the text in realtime, match profiles in user’s network and show recommendations on who to send this question to.
- User can select one or more or all recommended users or select other users of their choice.
- User can review questions from others, answer them or ignore

## Technologies
The follwowing technologies are used in this project:
- ionic framework
- angularjs
- firebase
- websql
- php

## Setup
### Prerequisites
You need the following to get this app up running:
- LinkedIn API key
- A web server supporting PHP

To get a LinkedIn API key, go to https://www.linkedin.com/secure/developer, register an account and add an application.  You will be assigned an API key and an OAuth User Token.

In the application detail page, under the *OAuth User Aggreement* secion, you will need to select the needed "Default Scope", go ahead to check the following:
- r_contactinfo
- r_network
- rw_nus
- r_fullprofile
This is to allow the app to access the information on your behalf.

You will also need to provide the "OAuth 2.0 Redirect URLs".  If you run your web server locally and it is running on port 8080, you can put "http://localhost:8080" (Assuming you are hosting this app under the web root)

### Configuration
After cloning the repo, go to the repo directory, open file site/config/sysconf.php, and update the API_KEY with your own LinkedIn API key, and set the REDIRECT_URI to the value you used to fill in the "OAuth 2.0 Redirect URLs" field above.  This should also be your webroot directory.

## Run
