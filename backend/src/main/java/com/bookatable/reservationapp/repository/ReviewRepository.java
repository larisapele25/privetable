package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRestaurantId(Long restaurantId);

    List<Review> findByUserId(Long userId);

    Optional<Review> findByUserIdAndReservationId(Long userId, Long reservationId);

    boolean existsByUserIdAndReservationId(Long userId, Long reservationId);
}
