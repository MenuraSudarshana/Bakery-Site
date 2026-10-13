package com.example.bakery_site.repository;

import com.example.bakery_site.model.CustomerReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    List<CustomerReview> findAllByOrderByIdDesc();
    List<CustomerReview> findByHiddenByAdminFalseAndAutoHiddenFalseOrderByIdDesc();
    List<CustomerReview> findByCustomerIdOrderByIdDesc(Integer customerId);
    Optional<CustomerReview> findByIdAndCustomerId(Long id, Integer customerId);
}
