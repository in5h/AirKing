<?php
// Quotation form mailer for cPanel / any PHP hosting.
// The website tries this first; on hosts without PHP (e.g. Netlify) it is skipped automatically.
// Edit the recipients below if they change.

$TO = 'sales@nextexpk.com';
$CC = 'insharahaman8@gmail.com';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST only']);
    exit;
}

// remove line breaks so nobody can inject extra email headers
function clean_line($v) { return trim(str_replace(["\r", "\n"], ' ', (string) $v)); }

$name    = clean_line($_POST['name'] ?? '');
$company = clean_line($_POST['company'] ?? '');
$email   = clean_line($_POST['email'] ?? '');
$phone   = clean_line($_POST['phone'] ?? '');
$product = clean_line($_POST['product'] ?? 'General enquiry');
$message = trim((string) ($_POST['message'] ?? ''));

if (!empty($_POST['_honey'])) { echo json_encode(['ok' => true]); exit; }   // spam bot
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please fill in your name, a valid email and your query.']);
    exit;
}

$subject = 'Quotation request: ' . $product . ' – ' . $name . ($company !== '' ? " ($company)" : '');
$body = "New quotation request from the AirKing website\n\n"
      . "Name:          $name\n"
      . "Company:       " . ($company !== '' ? $company : '-') . "\n"
      . "Email:         $email\n"
      . "Phone:         " . ($phone !== '' ? $phone : '-') . "\n"
      . "Interested in: $product\n\n"
      . "Message:\n$message\n";

// Send from an address on this website's own domain (required by most cPanel hosts); replies go to the customer.
$host = preg_replace(['/^www\./', '/:\d+$/'], '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$headers = [
    'From: AirKing Website <no-reply@' . $host . '>',
    'Reply-To: ' . $email,
    'Cc: ' . $CC,
    'Content-Type: text/plain; charset=UTF-8',
];

$ok = mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
if (!$ok) http_response_code(500);
echo json_encode(['ok' => $ok]);
