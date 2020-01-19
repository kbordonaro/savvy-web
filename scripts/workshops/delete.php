<?php

include 'workshops/authenticate.php';

$sql = "SELECT * from `workshops` WHERE date='$date'";
$result = mysqli_query($link, $sql);

if(mysqli_num_rows($result) > 0) {
  $workshop = mysqli_fetch_object($result);
  $new_count = $workshop->count - $count;

  if($new_count <= 0) {
    $sql = "DELETE FROM `workshops` WHERE date='$date'";
  } else {
    $old_students = explode(",", $workshop->students);
    $new_students = '';
    $deleted = 0;
    for($i=0; $i<count($old_students); $i++) {
      if($old_students[$i] == $email && $deleted < $count) {
        $deleted++;
      } else {
        $new_students .= (($i-$deleted > 0) ? ',' : '').$old_students[$i];
      }
    }
    $sql = "UPDATE `workshops` SET count='$new_count', students='$new_students' WHERE date='$date'";
  }

  // Insert/Update into the workshop table.
  $result = mysqli_query($link, $sql);
  if (!$result) {
    http_response_code(404);
    die(mysqli_error($link));
  }
}

// Email a backup.
$subject = 'Workshop: ' . $date;
$address = "Savvy Creations <info@savvycreationsdesign.com>";
$message = "REMOVE\nEmail: $email\nCount: $count";
mail($address, $subject, $message, "From: " . $address);

echo "Success";

?>
