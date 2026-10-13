package com.example.bakery_site.model;

import jakarta.persistence.*;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;

    private int persons; // ✅ MUST be int

    private String reservationDate;
    private String reservationTime;

    private String message;
    private String reservationStatus;
    private boolean cancelRequested;
    private boolean updateRequested;

    @Column(length = 1000)
    private String updateRequestNote;

    private String createdAt;

    // ✅ ALL GETTERS + SETTERS REQUIRED

    public String getReservationDate() {
        return reservationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(String reservationTime) {
        this.reservationTime = reservationTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPersons() { return persons; }
    public void setPersons(int persons) { this.persons = persons; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getReservationStatus() {
        return reservationStatus;
    }

    public void setReservationStatus(String reservationStatus) {
        this.reservationStatus = reservationStatus;
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
