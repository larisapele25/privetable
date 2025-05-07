package com.bookatable.reservationapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer quantity;

    private LocalDateTime addedAt = LocalDateTime.now();

    public CartItem(Reservation reservation, Product product, User user, Integer quantity, LocalDateTime addedAt) {
        this.reservation = reservation;
        this.product = product;
        this.user = user;
        this.quantity = quantity;
        this.addedAt = addedAt;
    }


    public CartItem() {

    }

    public Long getId() {
        return id;
    }
    public Reservation getReservation() {
       return reservation;
    }
    public Product getProduct() {
       return product;
    }
    public User getUser() {
       return user;
    }
    public Integer getQuantity() {
       return quantity;
    }
    public LocalDateTime getAddedAt() {
       return addedAt;
    }
    public void setAddedAt(LocalDateTime addedAt) {
       this.addedAt = addedAt;
    }
    public void setQuantity(Integer quantity) {
       this.quantity = quantity;
    }
    public void setReservation(Reservation reservation) {
       this.reservation = reservation;
    }
    public void setProduct(Product product) {
       this.product = product;
    }
    public void setUser(User user) {
       this.user = user;
    }
    public void setId(Long id) {
       this.id = id;
    }

}
