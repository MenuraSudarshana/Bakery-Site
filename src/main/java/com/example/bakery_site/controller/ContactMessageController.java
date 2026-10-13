package com.example.bakery_site.controller;

import com.example.bakery_site.dto.ContactMessageRequestDto;
import com.example.bakery_site.service.IContactMessageService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final IContactMessageService contactMessageService;

    public ContactMessageController(IContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    public String createContactMessage(@RequestBody ContactMessageRequestDto request) {
        return contactMessageService.createContactMessage(request);
    }
}
