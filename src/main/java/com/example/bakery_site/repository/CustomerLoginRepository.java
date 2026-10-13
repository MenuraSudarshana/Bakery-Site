package com.example.bakery_site.repository;

import com.example.bakery_site.model.CustomerLogin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerLoginRepository extends JpaRepository<CustomerLogin, Integer> {

    boolean existsByEmail(String email);

    CustomerLogin findByEmail(String email);

    CustomerLogin findByEmailAndPassword(String email, String password);

    CustomerLogin findByEmailAndPasswordAndActiveTrue(String email, String password);
}
