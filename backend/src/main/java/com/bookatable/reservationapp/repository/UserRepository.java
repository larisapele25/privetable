package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetCode(String resetCode);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.favoriteRestaurants")
    List<User> findAllWithFavorites();


}
