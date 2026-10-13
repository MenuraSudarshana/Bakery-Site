package com.example.bakery_site.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "customer_order")
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Integer customerId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false, length = 10)
    private String customerPhone;

    @Column(nullable = false, length = 500)
    private String customerAddress;

    @Column(nullable = false)
    private String pickupDate;

    @Column(nullable = false)
    private String pickupTime;

    @Column(nullable = false)
    private String paymentMethod;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String orderItems;

    @Column(nullable = false)
    private double total;

    @Column(nullable = false)
    private String orderStatus;

    @Column(nullable = false)
    private boolean cancelRequested;

    @Column(nullable = false)
    private boolean updateRequested;

    @Column(length = 1000)
    private String updateRequestNote;

    @Column(nullable = false)
    private String createdAt;


}
