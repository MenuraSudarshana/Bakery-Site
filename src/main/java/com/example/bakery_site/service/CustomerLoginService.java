package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomerAuthResponseDto;
import com.example.bakery_site.dto.CustomerDto;
import com.example.bakery_site.dto.CustomerLoginRequestDto;
import com.example.bakery_site.dto.CustomerPasswordResetRequestDto;
import com.example.bakery_site.dto.CustomerProfileUpdateRequestDto;
import com.example.bakery_site.dto.CustomerRegisterRequestDto;
import com.example.bakery_site.model.CustomerLogin;
import com.example.bakery_site.repository.CustomerLoginRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerLoginService implements ICustomerLoginService {

    private final CustomerLoginRepository customerLoginRepository;

    public CustomerLoginService(CustomerLoginRepository customerLoginRepository) {
        this.customerLoginRepository = customerLoginRepository;
    }

    @Override
    public CustomerAuthResponseDto register(CustomerRegisterRequestDto request) {
        String name = clean(request.getName());
        String email = clean(request.getEmail()).toLowerCase();
        String phone = clean(request.getPhone());
        String address = clean(request.getAddress());
        String password = clean(request.getPassword());
        String confirmPassword = clean(request.getConfirmPassword());

        String validationError = validateRegistration(name, email, phone, address, password, confirmPassword);
        if (validationError != null) {
            return CustomerAuthResponseDto.failure(validationError);
        }

        if (customerLoginRepository.existsByEmail(email)) {
            return CustomerAuthResponseDto.failure("An account with this email already exists.");
        }

        CustomerLogin customer = new CustomerLogin();
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setPassword(password);

        CustomerLogin savedCustomer = customerLoginRepository.save(customer);
        return CustomerAuthResponseDto.success("Registration successful.", toCustomerDto(savedCustomer));
    }

    @Override
    public CustomerAuthResponseDto login(CustomerLoginRequestDto request) {
        String email = clean(request.getEmail()).toLowerCase();
        String password = clean(request.getPassword());

        if (email.isEmpty() || password.isEmpty()) {
            return CustomerAuthResponseDto.failure("Email and password are required.");
        }

        CustomerLogin customer = customerLoginRepository.findByEmailAndPasswordAndActiveTrue(email, password);
        if (customer == null) {
            return CustomerAuthResponseDto.failure("Invalid email or password, or your account is disabled.");
        }

        return CustomerAuthResponseDto.success("Login successful.", toCustomerDto(customer));
    }

    @Override
    public CustomerAuthResponseDto updateProfile(CustomerProfileUpdateRequestDto request) {
        if (request.getCustomerId() == null) {
            return CustomerAuthResponseDto.failure("Customer session not found. Please login again.");
        }

        CustomerLogin customer = customerLoginRepository.findById(request.getCustomerId()).orElse(null);
        if (customer == null) {
            return CustomerAuthResponseDto.failure("Customer account not found.");
        }

        String name = clean(request.getName());
        String phone = clean(request.getPhone());
        String address = clean(request.getAddress());

        if (name.isEmpty() || phone.isEmpty() || address.isEmpty()) {
            return CustomerAuthResponseDto.failure("Name, phone, and address are required.");
        }

        if (!phone.matches("^\\d{10}$")) {
            return CustomerAuthResponseDto.failure("Phone number must contain exactly 10 digits.");
        }

        customer.setName(name);
        customer.setPhone(phone);
        customer.setAddress(address);

        CustomerLogin saved = customerLoginRepository.save(customer);
        return CustomerAuthResponseDto.success("Profile updated successfully.", toCustomerDto(saved));
    }

    @Override
    public CustomerAuthResponseDto resetPassword(CustomerPasswordResetRequestDto request) {
        if (request.getCustomerId() == null) {
            return CustomerAuthResponseDto.failure("Customer session not found. Please login again.");
        }

        CustomerLogin customer = customerLoginRepository.findById(request.getCustomerId()).orElse(null);
        if (customer == null) {
            return CustomerAuthResponseDto.failure("Customer account not found.");
        }

        String currentPassword = clean(request.getCurrentPassword());
        String newPassword = clean(request.getNewPassword());
        String confirmPassword = clean(request.getConfirmPassword());

        if (currentPassword.isEmpty() || newPassword.isEmpty() || confirmPassword.isEmpty()) {
            return CustomerAuthResponseDto.failure("All password fields are required.");
        }

        if (!customer.getPassword().equals(currentPassword)) {
            return CustomerAuthResponseDto.failure("Current password is incorrect.");
        }

        if (newPassword.length() < 6) {
            return CustomerAuthResponseDto.failure("New password must be at least 6 characters.");
        }

        if (!newPassword.equals(confirmPassword)) {
            return CustomerAuthResponseDto.failure("New password confirmation does not match.");
        }

        customer.setPassword(newPassword);
        customerLoginRepository.save(customer);
        return CustomerAuthResponseDto.success("Password updated successfully.", toCustomerDto(customer));
    }

    private String validateRegistration(
            String name,
            String email,
            String phone,
            String address,
            String password,
            String confirmPassword
    ) {
        if (name.isEmpty() || email.isEmpty() || phone.isEmpty() || address.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            return "All fields are required.";
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return "Please enter a valid email address.";
        }

        if (!phone.matches("^\\d{10}$")) {
            return "Phone number must contain exactly 10 digits.";
        }

        if (password.length() < 6) {
            return "Password must be at least 6 characters long.";
        }

        if (!password.equals(confirmPassword)) {
            return "Password confirmation does not match.";
        }

        return null;
    }

    private CustomerDto toCustomerDto(CustomerLogin customer) {
        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(customer.getId());
        customerDto.setName(customer.getName());
        customerDto.setEmail(customer.getEmail());
        customerDto.setPhone(customer.getPhone());
        customerDto.setAddress(customer.getAddress());
        return customerDto;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
