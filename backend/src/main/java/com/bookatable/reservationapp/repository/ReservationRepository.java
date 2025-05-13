package com.bookatable.reservationapp.repository;

import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;



public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Rezervări viitoare pentru un user
    List<Reservation> findByUserAndDateTimeAfterOrderByDateTimeAsc(User user, LocalDateTime now);

    // Rezervări trecute pentru un user (pentru Book Again)
    List<Reservation> findByUserAndDateTimeBefore(User user, LocalDateTime now);

    @Query("SELECT r FROM Reservation r WHERE r.restaurant.id = :restaurantId AND DATE(r.dateTime) = :date")
    List<Reservation> findByRestaurantIdAndDate(
            @Param("restaurantId") Long restaurantId,
            @Param("date") LocalDate date
    );
    @Query("SELECT r FROM Reservation r WHERE (r.user = :user OR :user MEMBER OF r.participants) AND r.dateTime > :now ORDER BY r.dateTime ASC")
    List<Reservation> findUpcomingReservationsForUser(@Param("user") User user, @Param("now") LocalDateTime now);

    List<Reservation> findByUserAndDateTimeBetween(User user, LocalDateTime start, LocalDateTime end);

    //adaugari
    List<Reservation> findByUser(User user);
    List<Reservation> findByParticipantsContaining(User user);
    List<Reservation> findByDateTimeBetweenAndNotifiedFalse(LocalDateTime start, LocalDateTime end);
    List<Reservation> findByRestaurantId(Long restaurantId);
    @Query("SELECT r FROM Reservation r WHERE r.restaurant.id = :restaurantId AND DATE(r.dateTime) = :date")
    List<Reservation> findByRestaurantIdAndDateExact(
            @Param("restaurantId") Long restaurantId,
            @Param("date") LocalDate date
    );


}
