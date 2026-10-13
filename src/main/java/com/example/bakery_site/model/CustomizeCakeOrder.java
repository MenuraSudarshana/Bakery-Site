package com.example.bakery_site.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customize_cake_order")
public class CustomizeCakeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String occasion;
    private String weight;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String designPhotoUrl;

    private String contactNumber;
    private String requiredDate;
    private String paymentMethod;
    private Integer layers;
    private String flavor;

    @Column(length = 2000)
    private String specifications;

    @Column(length = 2000)
    private String note;

    private String orderStatus;
    private boolean cancelRequested;
    private boolean updateRequested;

    @Column(length = 1000)
    private String updateRequestNote;

    private String createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getDesignPhotoUrl() {
        return designPhotoUrl;
    }

    public void setDesignPhotoUrl(String designPhotoUrl) {
        this.designPhotoUrl = designPhotoUrl;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(String requiredDate) {
        this.requiredDate = requiredDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Integer getLayers() {
        return layers;
    }

    public void setLayers(Integer layers) {
        this.layers = layers;
    }

    public String getFlavor() {
        return flavor;
    }

    public void setFlavor(String flavor) {
        this.flavor = flavor;
    }

    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public boolean isCancelRequested() {
        return cancelRequested;
    }

    public void setCancelRequested(boolean cancelRequested) {
        this.cancelRequested = cancelRequested;
    }

    public boolean isUpdateRequested() {
        return updateRequested;
    }

    public void setUpdateRequested(boolean updateRequested) {
        this.updateRequested = updateRequested;
    }

    public String getUpdateRequestNote() {
        return updateRequestNote;
    }

    public void setUpdateRequestNote(String updateRequestNote) {
        this.updateRequestNote = updateRequestNote;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
