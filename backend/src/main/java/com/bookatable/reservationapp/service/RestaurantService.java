package com.bookatable.reservationapp.service;

import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.model.Restaurant;
import com.bookatable.reservationapp.model.User;
import com.bookatable.reservationapp.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final ReservationRepository reservationRepository;

    public RestaurantService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // Restaurantele la care userul a fost deja (fără dubluri)
    public Set<Restaurant> getRestaurantsBookedBefore(User user) {
        List<Reservation> pastReservations = reservationRepository.findByUserAndDateTimeBefore(user, LocalDateTime.now());

        return pastReservations.stream()
                .map(Reservation::getRestaurant)
                .collect(Collectors.toSet());
    }
}
