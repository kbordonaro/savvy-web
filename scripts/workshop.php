<?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

// Connect to the database
$link = mysqli_connect('kborvonarl.ipagemysql.com', 'client', '$in0n66', 'savvy');
mysqli_set_charset($link,'utf8');

// Process the input data.
$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
$values = array_map(function ($value) use ($link) {
  if ($value===null) return null;
  return mysqli_real_escape_string($link,(string)$value);
},array_values($input));

$count = 1;
$student = '';
$date = null;
$email = null;
$name = null;
$phone = null;
$remove = 0;
for ($i=0;$i<count($columns);$i++) {
  if($columns[$i] == 'count') {
    $count = $values[$i];
  } else if($columns[$i] == 'date') {
    $date = $values[$i];
  } else if($columns[$i] == 'email') {
    $email = $values[$i];
  } else if($columns[$i] == 'name') {
    $name = $values[$i];
  } else if($columns[$i] == 'phone') {
    $phone = $values[$i];
  } else if($columns[$i] == 'remove') {
    $remove = $values[$i];
  }
}

if($method == 'GET') {
  include 'workshops/get.php';
} else if($method == 'POST' && $remove) {
  include 'workshops/delete.php';
} else if($method == 'POST') {
  include 'workshops/post.php';
} else {
  http_response_code(501);
}
 
// close mysql connection
mysqli_close($link);

?>
