package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantId(Long restaurantId);
    List<Review> findByUserId(Long userId);
}
