package com.bookatable.reservationapp.dto;

import java.time.LocalDateTime;

public class ReservationDetailsDTO {
    private String restaurantName;
    private LocalDateTime dateTime;
    private int numberOfPeople;
    private int duration;
    private Long createdById;


    public ReservationDetailsDTO(String restaurantName, LocalDateTime dateTime, int numberOfPeople, int duration, Long createdById) {
        this.restaurantName = restaurantName;
        this.dateTime = dateTime;
        this.numberOfPeople = numberOfPeople;
        this.duration = duration;
        this.createdById = createdById;
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

    public Long getCreatedById() {
        return createdById;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }
    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }
    public void setDuration(int duration) {
        this.duration = duration;
    }
    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

}
