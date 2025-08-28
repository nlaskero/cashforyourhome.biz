<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Where the email should go
    $to = "nlaskero@email.com"; 

    // Subject line
    $subject = "New Cash Offer Request from Website";

    // Collect and sanitize form data
    $address = htmlspecialchars($_POST['property-address']);
    $condition = htmlspecialchars($_POST['property-condition']);
    $timeline = htmlspecialchars($_POST['timeline']);
    $name = htmlspecialchars($_POST['seller-name']);
    $phone = htmlspecialchars($_POST['seller-phone']);
    $email = htmlspecialchars($_POST['email']);

    // Build email body
    $message = "You have a new property inquiry:\n\n";
    $message .= "🏠 Address: $address\n";
    $message .= "🔧 Condition: $condition\n";
    $message .= "📅 Timeline: $timeline\n";
    $message .= "👤 Name: $name\n";
    $message .= "📞 Phone: $phone\n";
    $message .= "✉️ Email: $email\n";

    // Headers (important: use a valid From domain)
    $headers = "From: noreply@yourdomain.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send the mail
    if (mail($to, $subject, $message, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
