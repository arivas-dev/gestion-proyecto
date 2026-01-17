<?php

namespace App\Mail;

use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mime\Message;
use Symfony\Component\Mime\Email;

class MailerooTransport extends AbstractTransport
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct(string $apiKey)
    {
        parent::__construct();
        $this->apiKey = $apiKey;
        $this->apiUrl = 'https://smtp.maileroo.com/send';
    }

    protected function doSend(SentMessage $message): void
    {
        $email = $message->getOriginalMessage();
        
        if (!$email instanceof Email) {
            throw new TransportException('Message must be an instance of Email');
        }
        
        $from = config('mail.from.address');
        
        if (empty($from) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
            $from = 'noreply@example.com';
        }
        
        $fromAddresses = $email->getFrom();
        if (!empty($fromAddresses)) {
            $fromAddress = $fromAddresses[0]->getAddress();
            if (filter_var($fromAddress, FILTER_VALIDATE_EMAIL) && strpos($fromAddress, '@') !== false) {
                $from = $fromAddress;
            }
        }
        
        if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
            throw new TransportException('Invalid from email address. Please configure MAIL_FROM_ADDRESS in .env with a valid email.');
        }
        
        $to = [];
        foreach ($email->getTo() as $recipient) {
            $address = $recipient->getAddress();
            if (filter_var($address, FILTER_VALIDATE_EMAIL)) {
                $to[] = $address;
            }
        }
        
        if (empty($to)) {
            throw new TransportException('No valid recipient specified');
        }
        
        $subject = $email->getSubject() ?? '';
        $html = $email->getHtmlBody();
        $text = $email->getTextBody();
        
        if (empty($html) && !empty($text)) {
            $html = '<p>' . nl2br(htmlspecialchars($text)) . '</p>';
        } elseif (empty($html)) {
            $html = '<p></p>';
        }
        
        $formData = [
            'from' => $from,
            'to' => implode(',', $to),
            'subject' => $subject,
            'html' => $html,
        ];
        
        $ch = curl_init($this->apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'X-API-Key: ' . $this->apiKey,
            ],
            CURLOPT_POSTFIELDS => http_build_query($formData),
            CURLOPT_SSL_VERIFYPEER => false, // Solo para desarrollo
            CURLOPT_SSL_VERIFYHOST => false, // Solo para desarrollo
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new TransportException('Maileroo cURL error: ' . $error);
        }
        
        if ($httpCode !== 200) {
            throw new TransportException('Maileroo API error (HTTP ' . $httpCode . '): ' . $response);
        }
    }

    public function __toString(): string
    {
        return 'maileroo';
    }
}
