package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByReservationId(Long reservationId);
    Optional<CartItem> findByReservationIdAndProductId(Long reservationId, Long productId);
    List<CartItem> findByReservationIdAndUserId(Long reservationId, Long userId);

}

