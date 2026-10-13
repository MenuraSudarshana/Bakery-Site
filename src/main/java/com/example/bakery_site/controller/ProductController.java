package com.example.bakery_site.controller;

import com.example.bakery_site.model.Product;
import com.example.bakery_site.service.IAdminService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/products")
public class ProductController {

    private final IAdminService adminService;

    public ProductController(IAdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/public")
    public List<Product> publicProducts() {
        return adminService.getPublicProducts();
    }
}
