package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.UserReviewByRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserReviewByRestaurantRepository extends JpaRepository<UserReviewByRestaurant, Long> {
    Optional<UserReviewByRestaurant> findByReservationIdAndUserId(Long reservationId, Long userId);
    boolean existsByReservationIdAndUserId(Long reservationId, Long userId);
    List<UserReviewByRestaurant> findByUserId(Long userId);
}

