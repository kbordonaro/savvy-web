<?php

$sql = "SELECT * from `workshops` WHERE date='$date'";
$result = mysqli_query($link, $sql);

// Validate.
if(strpos($email, ',')) {
  http_response_code(400);
  die();
}

if(strlen($email) > 255) {
  http_response_code(400);
  die();
}

if(mysqli_num_rows($result) > 0) {
  $workshop = mysqli_fetch_object($result);
  $students = $workshop->students;
  for($i=0;$i<$count;$i++) {
    $students .= ','.$email;
  }
  $totalCount = $workshop->count + $count;
  $sql = "UPDATE `workshops` SET count='$totalCount', students='$students' WHERE date='$date'";
} else {
  $students = '';
  for($i=0;$i<$count;$i++) {
    $students .= ($i>0?',':'').$email;
  }
  $sql = "INSERT INTO `workshops` (date, count, students) VALUES ('$date', '$count', '$students')";
}

// Insert/Update into the workshop table.
$result = mysqli_query($link, $sql);
if (!$result) {
  http_response_code(404);
  die(mysqli_error($link));
}

// Update the student table.
$sql = "INSERT INTO `students` (email, name, phone) VALUES ('$email', '$name', '$phone') ON DUPLICATE KEY UPDATE name='$name', phone='$phone'";
$result = mysqli_query($link, $sql);
if (!$result) {
  http_response_code(404);
  die(mysqli_error($link));
}

// Email a backup.
$subject = 'Workshop: ' . $date;
$address = "Savvy Creations <info@savvycreationsdesign.com>";
$message = "Name: $name\nEmail: $email\nPhone: $phone\nCount: $count";
mail($address, $subject, $message, "From: " . $address);

echo "Success";

?>
