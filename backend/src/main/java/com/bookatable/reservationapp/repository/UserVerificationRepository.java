package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.UserVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {
    Optional<UserVerification> findByUserId(Long userId);
    List<UserVerification> findAllByUserId(Long userId);

}
