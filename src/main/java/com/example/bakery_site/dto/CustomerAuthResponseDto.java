package com.example.bakery_site.dto;

public class CustomerAuthResponseDto {

    private boolean success;
    private String message;
    private CustomerDto customer;

    public static CustomerAuthResponseDto failure(String message) {
        CustomerAuthResponseDto response = new CustomerAuthResponseDto();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    public static CustomerAuthResponseDto success(String message, CustomerDto customer) {
        CustomerAuthResponseDto response = new CustomerAuthResponseDto();
        response.setSuccess(true);
        response.setMessage(message);
        response.setCustomer(customer);
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public CustomerDto getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDto customer) {
        this.customer = customer;
    }
}
