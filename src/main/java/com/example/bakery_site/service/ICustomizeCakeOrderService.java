package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomizeCakeOrderRequestDto;

public interface ICustomizeCakeOrderService {
    String createOrder(CustomizeCakeOrderRequestDto request);
}
