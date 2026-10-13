package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomerOrderRequestDto;
import com.example.bakery_site.dto.CustomerOrderResponseDto;

public interface ICustomerOrderService {

    CustomerOrderResponseDto createOrder(CustomerOrderRequestDto request);
}
