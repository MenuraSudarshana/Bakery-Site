package com.example.bakery_site.repository;

import com.example.bakery_site.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    List<CustomerOrder> findAllByOrderByIdDesc();

    List<CustomerOrder> findByOrderStatusIgnoreCaseOrderByIdDesc(String orderStatus);

    List<CustomerOrder> findByCustomerIdOrderByIdDesc(Integer customerId);

    List<CustomerOrder> findByCustomerEmailIgnoreCaseOrderByIdDesc(String customerEmail);

    long countByOrderStatusIgnoreCase(String orderStatus);
}
