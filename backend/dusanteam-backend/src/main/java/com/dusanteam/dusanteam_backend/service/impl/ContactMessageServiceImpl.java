package com.dusanteam.dusanteam_backend.service.impl;

import com.dusanteam.dusanteam_backend.entity.ContactMessage;
import com.dusanteam.dusanteam_backend.repository.ContactMessageRepository;
import com.dusanteam.dusanteam_backend.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final int MAX_MESSAGE = 5000;

    private final ContactMessageRepository repository;
    private final ObjectProvider<JavaMailSender> mailSender;

    /** The business inbox: messages are sent from and to this address. Empty = don't send email. */
    @Value("${spring.mail.username:}")
    private String adminEmail;

    @Override
    public void sendMessage(String email, String message) {
        String from = email == null ? "" : email.trim();
        String body = message == null ? "" : message.trim();
        if (from.length() > 254 || !EMAIL.matcher(from).matches()) {
            throw new IllegalArgumentException("Invalid email address");
        }
        if (body.isEmpty()) {
            throw new IllegalArgumentException("Message is empty");
        }
        if (body.length() > MAX_MESSAGE) {
            throw new IllegalArgumentException("Message is too long (max " + MAX_MESSAGE + " characters)");
        }

        // Always keep a copy in the database
        repository.save(ContactMessage.builder().email(from).message(body).build());

        JavaMailSender sender = mailSender.getIfAvailable();
        if (adminEmail.isBlank() || sender == null) {
            log.info("Email is not configured: contact message from {} saved to the database only", from);
            return;
        }

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(adminEmail);
        mail.setTo(adminEmail);
        mail.setReplyTo(from); // pressing "Reply" answers the visitor directly
        mail.setSubject("New message from website: " + from);
        mail.setText("From: " + from + "\n\n" + body);
        sender.send(mail);
    }
}
