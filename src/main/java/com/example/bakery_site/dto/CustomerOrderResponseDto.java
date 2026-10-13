package com.example.bakery_site.dto;

public class CustomerOrderResponseDto {

    private boolean success;
    private String message;
    private Integer orderId;
    private String orderStatus;

    public static CustomerOrderResponseDto failure(String message) {
        CustomerOrderResponseDto response = new CustomerOrderResponseDto();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    public static CustomerOrderResponseDto success(String message, Integer orderId, String orderStatus) {
        CustomerOrderResponseDto response = new CustomerOrderResponseDto();
        response.setSuccess(true);
        response.setMessage(message);
        response.setOrderId(orderId);
        response.setOrderStatus(orderStatus);
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

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }
}
