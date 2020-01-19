<?php

// get the HTTP method, path and body of the request
function isAuthenticated() {
  return ($_SERVER['REMOTE_ADDR'] == '74.98.245.164') || $_SESSION['isAuthenticated'];
}

session_save_path('/home/users/web/b454/ipg.kborvonarl/sessions');
session_start();

if(!isAuthenticated()) {
  http_response_code(401);
  exit();
}

?>
