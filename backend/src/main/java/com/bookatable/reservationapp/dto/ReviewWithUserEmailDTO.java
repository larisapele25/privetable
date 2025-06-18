package com.bookatable.reservationapp.dto;

import java.time.LocalDateTime;

public class ReviewWithUserEmailDTO {
    private int rating;
    private String comment;
    private String userEmail;
    private LocalDateTime reservationDateTime;

    // Getters & setters
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDateTime getReservationDateTime() { return reservationDateTime; }
    public void setReservationDateTime(LocalDateTime reservationDateTime) { this.reservationDateTime = reservationDateTime; }
}
