<?php

$input = json_decode(file_get_contents('php://input'), true);

if(isset($input['username']) && isset($input['password']) &&
   $input['username'] == 'admin' && $input['password'] == '123') {
  // Successfully authenticated, initialize session and return success.
  session_save_path('/home/users/web/b454/ipg.kborvonarl/sessions');
  session_start();
  session_regenerate_id(true);
  $_SESSION['isAuthenticated'] = true;

  http_response_code(204);
} else {
  // Did not authenticate, return 401 error.
  http_response_code(401);
}

?>
