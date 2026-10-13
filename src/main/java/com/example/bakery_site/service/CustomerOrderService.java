package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomerOrderRequestDto;
import com.example.bakery_site.dto.CustomerOrderResponseDto;
import com.example.bakery_site.model.CustomerOrder;
import com.example.bakery_site.repository.CustomerOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CustomerOrderService implements ICustomerOrderService {

    private final CustomerOrderRepository customerOrderRepository;

    public CustomerOrderService(CustomerOrderRepository customerOrderRepository) {
        this.customerOrderRepository = customerOrderRepository;
    }

    @Override
    public CustomerOrderResponseDto createOrder(CustomerOrderRequestDto request) {
        String customerName = clean(request.getCustomerName());
        String customerEmail = clean(request.getCustomerEmail()).toLowerCase();
        String customerPhone = clean(request.getCustomerPhone());
        String customerAddress = clean(request.getCustomerAddress());
        String pickupDate = clean(request.getPickupDate());
        String pickupTime = clean(request.getPickupTime());
        String paymentMethod = clean(request.getPaymentMethod());
        String orderItems = clean(request.getOrderItems());
        double total = parseDouble(request.getTotal());

        String validationError = validateOrder(
                customerName,
                customerEmail,
                customerPhone,
                customerAddress,
                pickupDate,
                pickupTime,
                paymentMethod,
                orderItems,
                total
        );
        if (validationError != null) {
            return CustomerOrderResponseDto.failure(validationError);
        }

        CustomerOrder order = new CustomerOrder();
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(customerName);
        order.setCustomerEmail(customerEmail);
        order.setCustomerPhone(customerPhone);
        order.setCustomerAddress(customerAddress);
        order.setPickupDate(pickupDate);
        order.setPickupTime(pickupTime);
        order.setPaymentMethod(paymentMethod);
        order.setOrderItems(orderItems);
        order.setTotal(total);
        order.setOrderStatus("Pending");
        order.setCancelRequested(false);
        order.setCreatedAt(LocalDateTime.now().toString());

        CustomerOrder savedOrder = customerOrderRepository.save(order);
        return CustomerOrderResponseDto.success("Order placed successfully.", savedOrder.getId(), savedOrder.getOrderStatus());
    }

    private String validateOrder(
            String customerName,
            String customerEmail,
            String customerPhone,
            String customerAddress,
            String pickupDate,
            String pickupTime,
            String paymentMethod,
            String orderItems,
            double total
    ) {
        if (
                customerName.isEmpty() ||
                customerEmail.isEmpty() ||
                customerPhone.isEmpty() ||
                pickupDate.isEmpty() ||
                pickupTime.isEmpty() ||
                paymentMethod.isEmpty() ||
                orderItems.isEmpty()
        ) {
            return "Please fill all checkout fields before confirming.";
        }

        if (paymentMethod.equals("Home Delivery") && customerAddress.isEmpty()) {
            return "Address is required for Home Delivery.";
        }

        if (!customerEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return "Please enter a valid customer email.";
        }

        if (!customerPhone.matches("^\\d{10}$")) {
            return "Phone number must contain exactly 10 digits.";
        }

        if (
                !paymentMethod.equals("Pay at Pickup") &&
                !paymentMethod.equals("Card on Collection") &&
                !paymentMethod.equals("Home Delivery")
        ) {
            return "Please choose a valid payment method.";
        }

        if (total <= 0) {
            return "Order total must be greater than zero.";
        }

        return null;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private double parseDouble(Object value) {
        try {
            return Double.parseDouble(String.valueOf(value).trim());
        } catch (Exception exception) {
            return 0;
        }
    }
}
