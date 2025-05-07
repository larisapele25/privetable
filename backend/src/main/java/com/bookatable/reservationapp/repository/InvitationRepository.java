package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Invitation;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    boolean existsByInvitedUserAndReservation(User user, Reservation reservation);
}
