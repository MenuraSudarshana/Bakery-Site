package com.example.bakery_site.repository;

import com.example.bakery_site.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findAllByOrderByIdDesc();

    List<Product> findByActiveTrueAndStockGreaterThanOrderByIdDesc(int stock);

    long countByActiveTrue();

    long countByActiveTrueAndStockLessThanEqual(int stock);

    Optional<Product> findByNameIgnoreCase(String name);
}
