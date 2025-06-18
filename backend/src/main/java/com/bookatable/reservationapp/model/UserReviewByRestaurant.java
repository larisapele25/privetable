package com.bookatable.reservationapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_reviews_by_restaurant", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"reservation_id", "user_id"})
})
public class UserReviewByRestaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Restaurant restaurant;

    @ManyToOne
    private User user;

    @ManyToOne
    private Reservation reservation;

    private int rating;

    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    public UserReviewByRestaurant() {}

    public UserReviewByRestaurant(Restaurant restaurant, User user, Reservation reservation, int rating, String comment) {
        this.restaurant = restaurant;
        this.user = user;
        this.reservation = reservation;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public void setUser(User user) {
        this.user = user;
    }
    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Long getId() {
        return id;
    }
    public Restaurant getRestaurant() {
        return restaurant;
    }
    public User getUser() {
        return user;
    }
    public Reservation getReservation() {
        return reservation;
    }
    public int getRating() {
        return rating;
    }
    public String getComment() {
        return comment;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
