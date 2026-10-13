package com.example.bakery_site.controller;

import com.example.bakery_site.dto.CustomerOrderRequestDto;
import com.example.bakery_site.dto.CustomerOrderResponseDto;
import com.example.bakery_site.service.ICustomerOrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/orders")
public class CustomerOrderController {

    private final ICustomerOrderService customerOrderService;

    public CustomerOrderController(ICustomerOrderService customerOrderService) {
        this.customerOrderService = customerOrderService;
    }

    @PostMapping
    public CustomerOrderResponseDto createOrder(@RequestBody CustomerOrderRequestDto request) {
        return customerOrderService.createOrder(request);
    }
}
