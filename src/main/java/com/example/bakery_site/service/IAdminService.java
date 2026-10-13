package com.example.bakery_site.service;

import com.example.bakery_site.dto.AdminProductCreateRequestDto;
import com.example.bakery_site.model.CustomerLogin;
import com.example.bakery_site.model.CustomerOrder;
import com.example.bakery_site.model.CustomizeCakeOrder;
import com.example.bakery_site.model.Product;
import com.example.bakery_site.model.Reservation;

import java.util.Map;
import java.util.List;

public interface IAdminService {

    Map<String, Object> getSummary();

    List<Product> getAllProducts();

    Product createProduct(AdminProductCreateRequestDto request);

    int importWebsiteCatalogProducts();

    Product updateProduct(Integer productId, AdminProductCreateRequestDto request);

    Product updateProductStock(Integer productId, Integer stock);

    Product updateProductActive(Integer productId, boolean active);
    void deleteProduct(Integer productId);

    List<CustomerOrder> getOrders(String status);

    CustomerOrder updateOrderStatus(Integer orderId, String status);

    List<Reservation> getReservations();

    Reservation updateReservationStatus(Long reservationId, String status);

    void deleteReservation(Long reservationId);

    List<CustomizeCakeOrder> getCustomizeCakeOrders(String status);

    CustomizeCakeOrder updateCustomizeCakeOrderStatus(Long orderId, String status);

    List<CustomerLogin> getCustomers();

    Map<String, Object> getCustomerDetails(Integer customerId);

    void deleteCustomer(Integer customerId);

    CustomerLogin updateCustomerActive(Integer customerId, boolean active);

    List<Product> getPublicProducts();
}
