package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.RestaurantAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantAccountRepository extends JpaRepository<RestaurantAccount, Long> {
    Optional<RestaurantAccount> findByLoginCode(String loginCode);
}

