package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.Notification;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String message;
    private String type;
    private LocalDateTime timestamp;
    private boolean read;
    private Long reservationId;
    private Long verificationId;
    private Long restaurantId;
    private Long recipientId;

    public NotificationDTO(Notification n) {
        this.id = n.getId();
        this.message = n.getMessage();
        this.type = n.getType();
        this.timestamp = n.getTimestamp();
        this.read = n.isRead();
        this.reservationId = n.getReservationId();
        this.verificationId = n.getVerificationId();
        this.restaurantId = n.getRestaurantId();
        this.recipientId = n.getRecipient() != null ? n.getRecipient().getId() : null;
    }

    public Long getId() { return id; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public boolean isRead() { return read; }
    public Long getReservationId() { return reservationId; }
    public Long getVerificationId() { return verificationId; }
    public Long getRestaurantId() { return restaurantId; }
    public Long getRecipientId() { return recipientId; }
}
