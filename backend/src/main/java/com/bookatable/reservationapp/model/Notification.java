package com.bookatable.reservationapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private boolean read = false;

    private LocalDateTime timestamp = LocalDateTime.now();

    private String type;

    private Long reservationId;

    private Long verificationId;

    private Long restaurantId;
    @ManyToOne
    @JsonIgnoreProperties({"verifications", "notifications", "password", "resetCode", "resetCodeTimestamp"})
    private User recipient;

    @Column(nullable = false)
    private boolean deleted = false;


    public Notification() {}

    public Notification(String message, String type, Long reservationId, User recipient) {
        this.message = message;
        this.type = type;
        this.reservationId = reservationId;
        this.recipient = recipient;
        this.timestamp = LocalDateTime.now();
    }


    public Long getId() {
     return this.id;
 }
 public void setId(Long id) {this.id=id;}
    public String getMessage() {return this.message;}
    public void setMessage(String message) {this.message=message;}
    public User getRecipient() {return this.recipient;}
    public void setRecipient(User recipient) {this.recipient=recipient;}
    public LocalDateTime getTimestamp() {return this.timestamp;}
    public void setTimestamp(LocalDateTime timestamp) {this.timestamp=timestamp;}

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(Long verificationId) {
        this.verificationId = verificationId;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public boolean isDeleted() {
        return deleted;
    }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
