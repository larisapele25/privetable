package com.bookatable.reservationapp.model;

import jakarta.persistence.*;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String category;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    // Constructors
    public Product() {}

    public Product(String name, String description, Double price, String category, Restaurant restaurant) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.restaurant = restaurant;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {this.id=id;}

    public String getName() {return name;}
    public void setName(String name) {this.name=name;}

    public String getDescription(){return description;}

    public void setDescription(String description){this.description=description;}
    public Double getPrice() {return price;}
    public void setPrice(Double price) {this.price = price;}
    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
    public Restaurant getRestaurant() {return restaurant;}
    public void setRestaurant(Restaurant restaurant) {this.restaurant = restaurant;}

}


