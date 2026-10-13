package com.example.bakery_site.service;

import com.example.bakery_site.dto.ContactMessageRequestDto;
import com.example.bakery_site.model.ContactMessage;
import com.example.bakery_site.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ContactMessageService implements IContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    public ContactMessageService(ContactMessageRepository contactMessageRepository, JavaMailSender mailSender) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailSender = mailSender;
    }

    @Override
    public String createContactMessage(ContactMessageRequestDto request) {
        String fullName = clean(request.getFullName());
        String email = clean(request.getEmail());
        String message = clean(request.getMessage());

        if (fullName.isEmpty() || email.isEmpty() || message.isEmpty()) {
            return "INVALID";
        }

        ContactMessage item = new ContactMessage();
        item.setFullName(fullName);
        item.setEmail(email);
        item.setMessage(message);
        item.setSubmittedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        contactMessageRepository.save(item);

        try {
            sendThankYouEmail(email, fullName);
            return "SUCCESS_EMAIL_SENT";
        } catch (Exception ex) {
            // Keep contact save successful even if SMTP is temporarily unavailable.
            String reason = clean(ex.getMessage());
            if (reason.length() > 180) {
                reason = reason.substring(0, 180);
            }
            return "SUCCESS_SAVED_EMAIL_FAILED:" + reason;
        }
    }

    private void sendThankYouEmail(String toEmail, String customerName) {
        SimpleMailMessage thankYouMail = new SimpleMailMessage();
        thankYouMail.setTo(toEmail);
        if (!clean(senderEmail).isEmpty()) {
            thankYouMail.setFrom(senderEmail);
        }
        thankYouMail.setSubject("Thank you for contacting Cake Factory");
        thankYouMail.setText(
                "Hi " + customerName + ",\n\n" +
                "Thank you for contacting Cake Factory.\n" +
                "We received your message and our team will contact you within 2-3 working days.\n\n" +
                "Best regards,\n" +
                "Cake Factory Team"
        );
        mailSender.send(thankYouMail);
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
