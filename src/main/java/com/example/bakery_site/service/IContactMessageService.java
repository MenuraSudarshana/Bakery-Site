package com.example.bakery_site.service;

import com.example.bakery_site.dto.ContactMessageRequestDto;

public interface IContactMessageService {
    String createContactMessage(ContactMessageRequestDto request);
}
