package com.dusanteam.dusanteam_backend.controller;

import com.dusanteam.dusanteam_backend.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService service;

    @PostMapping
    public ResponseEntity<Void> sendMessage(@RequestParam String email, @RequestParam String message) {
        service.sendMessage(email, message);
        return ResponseEntity.ok().build();
    }
}
