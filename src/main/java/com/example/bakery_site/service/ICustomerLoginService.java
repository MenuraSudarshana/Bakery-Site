package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomerAuthResponseDto;
import com.example.bakery_site.dto.CustomerLoginRequestDto;
import com.example.bakery_site.dto.CustomerPasswordResetRequestDto;
import com.example.bakery_site.dto.CustomerProfileUpdateRequestDto;
import com.example.bakery_site.dto.CustomerRegisterRequestDto;

public interface ICustomerLoginService {

    CustomerAuthResponseDto register(CustomerRegisterRequestDto request);

    CustomerAuthResponseDto login(CustomerLoginRequestDto request);

    CustomerAuthResponseDto updateProfile(CustomerProfileUpdateRequestDto request);

    CustomerAuthResponseDto resetPassword(CustomerPasswordResetRequestDto request);
}
