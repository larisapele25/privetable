package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByReservationId(Long reservationId);
    Optional<CartItem> findByReservationIdAndProductId(Long reservationId, Long productId);
    List<CartItem> findByReservationIdAndUserId(Long reservationId, Long userId);
    List<CartItem> findByProductRestaurantId(Long restaurantId);
    @Query("SELECT c FROM CartItem c WHERE c.product.restaurant.id = :restaurantId AND DATE(c.reservation.dateTime) = :date")
    List<CartItem> findByReservationDate(@Param("restaurantId") Long restaurantId, @Param("date") LocalDate date);



    List<CartItem> findByProductId(Long productId);
}

