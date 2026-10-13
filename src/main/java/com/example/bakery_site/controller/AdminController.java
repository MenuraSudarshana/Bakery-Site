package com.example.bakery_site.controller;

import com.example.bakery_site.dto.AdminProductCreateRequestDto;
import com.example.bakery_site.model.CustomerLogin;
import com.example.bakery_site.model.CustomerOrder;
import com.example.bakery_site.model.CustomizeCakeOrder;
import com.example.bakery_site.model.Product;
import com.example.bakery_site.model.Reservation;
import com.example.bakery_site.service.IAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/admin")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return adminService.getSummary();
    }

    //Product Part

    @GetMapping("/products")
    public List<Product> products() {
        return adminService.getAllProducts();
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody AdminProductCreateRequestDto request) {
        return adminService.createProduct(request);
    }

    @PostMapping("/products/upload-image")
    public Map<String, Object> uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file.");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!contentType.equals("image/png") && !contentType.equals("image/jpeg") && !contentType.equals("image/jpg")) {
            throw new IllegalArgumentException("Only PNG and JPG images are allowed.");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        String extension = originalName.endsWith(".png") ? ".png" : ".jpg";
        String fileName = "product-" + UUID.randomUUID() + extension;

        Path uploadDir = Paths.get("uploads", "product-images").toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);

        Path target = uploadDir.resolve(fileName).normalize();
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return Map.of(
                "success", true,
                "url", "/uploads/product-images/" + fileName
        );
    }

    @PostMapping("/products/import-catalog")
    public Map<String, Object> importCatalogProducts() {
        int inserted = adminService.importWebsiteCatalogProducts();
        return Map.of("success", true, "inserted", inserted);
    }

    @PutMapping("/products/{productId}")
    public Product updateProduct(@PathVariable Integer productId, @RequestBody AdminProductCreateRequestDto request) {
        return adminService.updateProduct(productId, request);
    }

    @PatchMapping("/products/{productId}/stock")
    public Product updateStock(@PathVariable Integer productId, @RequestParam Integer stock) {
        return adminService.updateProductStock(productId, stock);
    }

    @PatchMapping("/products/{productId}/active")
    public Product updateActive(@PathVariable Integer productId, @RequestParam boolean active) {
        return adminService.updateProductActive(productId, active);
    }

    @DeleteMapping("/products/{productId}")
    public Map<String, Object> deleteProduct(@PathVariable Integer productId) {
        adminService.deleteProduct(productId);
        return Map.of("success", true);
    }

    @GetMapping("/orders")
    public List<CustomerOrder> orders(@RequestParam(defaultValue = "all") String status) {
        return adminService.getOrders(status);
    }

    @PatchMapping("/orders/{orderId}/status")
    public CustomerOrder updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        return adminService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/reservations")
    public List<Reservation> reservations() {
        return adminService.getReservations();
    }

    @PatchMapping("/reservations/{reservationId}/status")
    public Reservation updateReservationStatus(@PathVariable Long reservationId, @RequestParam String status) {
        return adminService.updateReservationStatus(reservationId, status);
    }

    @DeleteMapping("/reservations/{reservationId}")
    public Map<String, Object> deleteReservation(@PathVariable Long reservationId) {
        adminService.deleteReservation(reservationId);
        return Map.of("success", true);
    }

    @GetMapping("/customize-cake-orders")
    public List<CustomizeCakeOrder> customizeCakeOrders(@RequestParam(defaultValue = "all") String status) {
        return adminService.getCustomizeCakeOrders(status);
    }

    @PatchMapping("/customize-cake-orders/{orderId}/status")
    public CustomizeCakeOrder updateCustomizeCakeOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return adminService.updateCustomizeCakeOrderStatus(orderId, status);
    }

    @GetMapping("/customers")
    public List<CustomerLogin> customers() {
        return adminService.getCustomers();
    }

    @GetMapping("/customers/{customerId}")
    public Map<String, Object> customerDetails(@PathVariable Integer customerId) {
        return adminService.getCustomerDetails(customerId);
    }

    @DeleteMapping("/customers/{customerId}")
    public Map<String, Object> deleteCustomer(@PathVariable Integer customerId) {
        adminService.deleteCustomer(customerId);
        return Map.of("success", true);
    }

    @PatchMapping("/customers/{customerId}/active")
    public CustomerLogin updateCustomerActive(@PathVariable Integer customerId, @RequestParam boolean active) {
        return adminService.updateCustomerActive(customerId, active);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(IllegalArgumentException exception) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", false);
        payload.put("message", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(payload);
    }
}
