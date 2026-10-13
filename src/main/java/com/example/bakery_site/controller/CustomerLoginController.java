package com.example.bakery_site.controller;

import com.example.bakery_site.dto.CustomerAuthResponseDto;
import com.example.bakery_site.dto.CustomerLoginRequestDto;
import com.example.bakery_site.dto.CustomerPasswordResetRequestDto;
import com.example.bakery_site.dto.CustomerProfileUpdateRequestDto;
import com.example.bakery_site.dto.CustomerRegisterRequestDto;
import com.example.bakery_site.service.ICustomerLoginService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/customers")
public class CustomerLoginController {

    private final ICustomerLoginService customerLoginService;

    public CustomerLoginController(ICustomerLoginService customerLoginService) {
        this.customerLoginService = customerLoginService;
    }

    @PostMapping("/register")
    public CustomerAuthResponseDto register(@RequestBody CustomerRegisterRequestDto request) {
        return customerLoginService.register(request);
    }

    @PostMapping("/login")
    public CustomerAuthResponseDto login(@RequestBody CustomerLoginRequestDto request) {
        return customerLoginService.login(request);
    }

    @PutMapping("/profile")
    public CustomerAuthResponseDto updateProfile(@RequestBody CustomerProfileUpdateRequestDto request) {
        return customerLoginService.updateProfile(request);
    }

    @PutMapping("/password")
    public CustomerAuthResponseDto resetPassword(@RequestBody CustomerPasswordResetRequestDto request) {
        return customerLoginService.resetPassword(request);
    }
}
