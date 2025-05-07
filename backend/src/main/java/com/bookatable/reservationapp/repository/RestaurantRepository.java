package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // deocamdată nu ai nevoie de metode custom aici
}
