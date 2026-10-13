package com.example.bakery_site.controller;

import com.example.bakery_site.dto.CustomizeCakeOrderRequestDto;
import com.example.bakery_site.service.ICustomizeCakeOrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/customize-cake-orders")
public class CustomizeCakeOrderController {

    private final ICustomizeCakeOrderService customizeCakeOrderService;

    public CustomizeCakeOrderController(ICustomizeCakeOrderService customizeCakeOrderService) {
        this.customizeCakeOrderService = customizeCakeOrderService;
    }

    @PostMapping
    public String createOrder(@RequestBody CustomizeCakeOrderRequestDto request) {
        return customizeCakeOrderService.createOrder(request);
    }
}
