package com.bookatable.reservationapp.dto;

import com.bookatable.reservationapp.model.Restaurant;

public class FavoriteRestaurantDTO {
    private Long id;
    private String name;
    private String imageUrl;

    public FavoriteRestaurantDTO(Restaurant restaurant) {
        this.id = restaurant.getId();
        this.name = restaurant.getName();
        this.imageUrl = restaurant.getImageUrl();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
}
