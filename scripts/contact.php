<?php

// configure
$sendTo = 'info@savvycreationsdesign.com';
$subject = 'New message from contact form';
$okMessage = 'Your message was successfully sent.  We will get back to you soon.  Thank you!';
$errorMessage = 'There was an error while submitting the form. Please try again later';

// let's do the sending

try
{
    $subject = 'Savvy: ';
    if (array_key_exists('subject', $_POST)) {
        $subject .= $_POST['subject'];
    }

    $from = "From: " . $_POST['name'] . "<" .  $_POST['email'] . ">";

    mail($sendTo, $subject, $_POST['message'], "From: " . $from);

    $responseArray = array('type' => 'success', 'message' => $okMessage);
}
catch (\Exception $e)
{
    $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}

if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);
    
    header('Content-Type: application/json');
    
    echo $encoded;
}
else {
    echo $responseArray['message'];
}

?>
