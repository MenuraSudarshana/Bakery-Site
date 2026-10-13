package com.example.bakery_site.service;

import com.example.bakery_site.dto.CustomizeCakeOrderRequestDto;
import com.example.bakery_site.model.CustomizeCakeOrder;
import com.example.bakery_site.repository.CustomizeCakeOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CustomizeCakeOrderService implements ICustomizeCakeOrderService {

    private final CustomizeCakeOrderRepository customizeCakeOrderRepository;

    public CustomizeCakeOrderService(CustomizeCakeOrderRepository customizeCakeOrderRepository) {
        this.customizeCakeOrderRepository = customizeCakeOrderRepository;
    }

    @Override
    public String createOrder(CustomizeCakeOrderRequestDto request) {
        String customerName = clean(request.getCustomerName());
        String customerEmail = clean(request.getCustomerEmail());
        String occasion = clean(request.getOccasion());
        String weight = clean(request.getWeight());
        String designPhotoUrl = clean(request.getDesignPhotoUrl());
        String contactNumber = clean(request.getContactNumber());
        String requiredDate = clean(request.getRequiredDate());
        String paymentMethod = clean(request.getPaymentMethod());

        if (customerName.isEmpty() || customerEmail.isEmpty()) {
            return "CUSTOMER_REQUIRED";
        }

        if (occasion.isEmpty() || weight.isEmpty() || contactNumber.isEmpty() || requiredDate.isEmpty() || paymentMethod.isEmpty()) {
            return "INVALID";
        }

        if (designPhotoUrl.isEmpty()) {
            return "IMAGE_REQUIRED";
        }

        CustomizeCakeOrder order = new CustomizeCakeOrder();
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(customerName);
        order.setCustomerEmail(customerEmail);
        order.setOccasion(occasion);
        order.setWeight(weight);
        order.setDesignPhotoUrl(designPhotoUrl);
        order.setContactNumber(contactNumber);
        order.setRequiredDate(requiredDate);
        order.setPaymentMethod(paymentMethod);
        order.setLayers(request.getLayers() == null || request.getLayers() < 1 ? 1 : request.getLayers());
        order.setFlavor(clean(request.getFlavor()));
        order.setSpecifications(clean(request.getSpecifications()));
        order.setNote(clean(request.getNote()));
        order.setOrderStatus("PENDING_REVIEW");
        order.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        customizeCakeOrderRepository.save(order);
        return "SUCCESS";
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
