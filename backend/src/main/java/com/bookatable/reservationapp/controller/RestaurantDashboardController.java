package com.bookatable.reservationapp.controller;


import com.bookatable.reservationapp.dto.ReservationDTO;
import com.bookatable.reservationapp.model.CartItem;
import com.bookatable.reservationapp.model.Reservation;
import com.bookatable.reservationapp.repository.ReservationRepository;
import com.bookatable.reservationapp.service.CartItemService;
import com.bookatable.reservationapp.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantDashboardController {

    private final ReservationService reservationService;
    private final CartItemService cartItemService;
    private final ReservationRepository reservationRepository;
    public RestaurantDashboardController(ReservationService reservationService, CartItemService cartItemService, ReservationRepository reservationRepository) {
        this.reservationService = reservationService;
        this.cartItemService = cartItemService;
        this.reservationRepository = reservationRepository;
    }




    @GetMapping("/reservations")
    public ResponseEntity<?> getAllReservations(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        return ResponseEntity.ok(reservationService.getReservationDetailsForRestaurant(restaurantId));
    }

    @GetMapping("/reservations/by-date")
    public ResponseEntity<?> getReservationsByDate(HttpServletRequest request, @RequestParam String date) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(reservationService.getReservationsForDate(restaurantId, localDate));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        return ResponseEntity.ok(cartItemService.getOrdersForDate(restaurantId, LocalDate.now()));
    }
    @GetMapping("/orders/by-date")
    public ResponseEntity<?> getOrdersByDate(HttpServletRequest request, @RequestParam String date) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(cartItemService.getOrderDTOsForDate(restaurantId, localDate));
    }


    @GetMapping("/reservations/past")
    public ResponseEntity<?> getPastReservations(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> reservations = reservationRepository.findByRestaurantIdAndDateTimeBefore(restaurantId, now);

        List<ReservationDTO> result = reservations.stream()
                .map(r -> new ReservationDTO(
                        r.getId(),
                        r.getUser().getId(),
                        r.getUser().getEmail(),
                        r.getParticipants().stream().map(p -> p.getId()).collect(Collectors.toList()),
                        r.getParticipants().stream().map(p -> p.getEmail()).collect(Collectors.toList())
                ))
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/user-history")
    public ResponseEntity<?> getAllUsersForRestaurant(HttpServletRequest request) {
        Long restaurantId = (Long) request.getAttribute("restaurantId");
        return ResponseEntity.ok(reservationService.getAllUsersFromReservations(restaurantId));
    }


}
