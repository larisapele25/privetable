package com.bookatable.reservationapp.dto;

public class RestaurantLoginResponse {
    private String token;
    private Long restaurantId;
    private String restaurantName;

    public RestaurantLoginResponse(String token, Long restaurantId, String restaurantName) {
        this.token = token;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
    }

    public String getToken() {
        return token;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }
    public String getRestaurantName() {
    return restaurantName;}


}

