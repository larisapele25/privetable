package com.bookatable.reservationapp.dto;

import java.time.LocalDateTime;

public class OrderDTO {
    private String productName;
    private int quantity;
    private String clientName;
    private LocalDateTime orderedAt;
    private Long reservationId;
    private Long userId;

    public OrderDTO(String productName, int quantity, String clientName, LocalDateTime orderedAt, Long reservationId, Long userId) {
        this.productName = productName;
        this.quantity = quantity;
        this.clientName = clientName;
        this.orderedAt = orderedAt;
        this.reservationId = reservationId;
        this.userId = userId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getClientName() {
        return clientName;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
    public Long getReservationId() {
        return reservationId;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
