package com.bookatable.reservationapp.dto;

import java.time.LocalDateTime;

public class OrderDTO {
    private String productName;
    private int quantity;
    private String clientName;
    private LocalDateTime orderedAt;

    public OrderDTO(String productName, int quantity, String clientName, LocalDateTime orderedAt) {
        this.productName = productName;
        this.quantity = quantity;
        this.clientName = clientName;
        this.orderedAt = orderedAt;
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
}
