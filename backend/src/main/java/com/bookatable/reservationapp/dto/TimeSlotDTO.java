package com.bookatable.reservationapp.dto;

public class TimeSlotDTO {
    private String time;
    private int maxDuration;

    public TimeSlotDTO(String time, int maxDuration) {
        this.time = time;
        this.maxDuration = maxDuration;
    }

    public String getTime() {
        return time;
    }

    public int getMaxDuration() {
        return maxDuration;
    }
}

