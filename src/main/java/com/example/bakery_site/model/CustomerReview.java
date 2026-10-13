package com.example.bakery_site.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer_review")
public class CustomerReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer customerId;

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, length = 200)
    private String customerEmail;

    @Column(nullable = false, length = 1500)
    private String reviewText;

    @Column(nullable = false)
    private Integer likesCount;

    @Column(nullable = false)
    private Integer dislikesCount;

    @Column(nullable = false)
    private boolean hiddenByAdmin;

    @Column(nullable = false)
    private boolean autoHidden;

    @Column(nullable = false, length = 40)
    private String createdAt;

    @Column(nullable = false, length = 40)
    private String updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }
    public Integer getDislikesCount() { return dislikesCount; }
    public void setDislikesCount(Integer dislikesCount) { this.dislikesCount = dislikesCount; }
    public boolean isHiddenByAdmin() { return hiddenByAdmin; }
    public void setHiddenByAdmin(boolean hiddenByAdmin) { this.hiddenByAdmin = hiddenByAdmin; }
    public boolean isAutoHidden() { return autoHidden; }
    public void setAutoHidden(boolean autoHidden) { this.autoHidden = autoHidden; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
