<?php

include 'workshops/authenticate.php';

if($_FILES['file']['error'] > 0) {
  http_response_code(404);
  die($_FILES['file']['error']);
}

$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$id = array_shift($request)+0;

move_uploaded_file($_FILES['file']['tmp_name'], '../assets/images/collection/' . $id . '.jpg');
http_response_code(204);

?>
