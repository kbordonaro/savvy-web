<?php

$input = json_decode(file_get_contents('php://input'), true);

// Send a workshop error.
$subject = '[SAVVY] WORKSHOP ERROR - ' . $input['date'];
$address = "Savvy Creations <info@savvycreationsdesign.com>";
$message = "Name: $input['name']\nEmail: $input['email']\nPhone: $input['phone']\nCount: $input['count']";
mail($address, $subject, $message, "From: " . $address);

echo "Success";

?>
