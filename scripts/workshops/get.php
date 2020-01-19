<?php

$date = $_GET['date'];
$admin = $_GET['admin'];

$sql = "SELECT * from `workshops` WHERE `date`".(!$date ? " >= NOW()" : " = '$date'");

$result = mysqli_query($link, $sql);

// die if SQL statement failed
if (mysql_errno()) { 
  http_response_code(404);
  die(mysqli_error());
}

if (!$date) echo '[';

if($admin) {
  include 'workshops/authenticate.php';

  for ($i=0;$i<mysqli_num_rows($result);$i++) {
    $workshop = mysqli_fetch_object($result);
    $students = explode(",", $workshop->students);
    for($j=0;$j<$workshop->count;$j++) {
      $sql = "SELECT * from `students` WHERE `email` = '$students[$j]'";
      $students_result = mysqli_query($link, $sql);
      mysqli_num_rows($students_result);
      $students[$j] = mysqli_fetch_object($students_result);
    }
    $workshop->students = $students;
    echo ($i>0?',':'').json_encode($workshop);
  }
} else {
  for ($i=0;$i<mysqli_num_rows($result);$i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
  }
}

if (!$date) echo ']';

?>
