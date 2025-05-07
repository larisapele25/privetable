package com.bookatable.reservationapp.dto;

import java.time.LocalDateTime;

public class ReservationDetailsDTO {
    private String restaurantName;
    private LocalDateTime dateTime;
    private int numberOfPeople;
    private int duration;

    public ReservationDetailsDTO(String restaurantName, LocalDateTime dateTime, int numberOfPeople, int duration) {
        this.restaurantName = restaurantName;
        this.dateTime = dateTime;
        this.numberOfPeople = numberOfPeople;
        this.duration = duration;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public int getDuration() {
        return duration;
    }
}
