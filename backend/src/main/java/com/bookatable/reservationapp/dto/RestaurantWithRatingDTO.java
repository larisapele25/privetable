package com.bookatable.reservationapp.dto;

public record RestaurantWithRatingDTO(
        Long id,
        String name,
        String imageUrl,
        Double averageRating
) {}
