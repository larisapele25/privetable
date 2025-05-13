package com.bookatable.reservationapp.dto;

public class RestaurantLoginResponse {
    private String token;
    private Long restaurantId;

    public RestaurantLoginResponse(String token, Long restaurantId) {
        this.token = token;
        this.restaurantId = restaurantId;
    }

    public String getToken() {
        return token;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }
}

