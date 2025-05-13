package com.bookatable.reservationapp.controller;


import com.bookatable.reservationapp.model.CartItem;
import com.bookatable.reservationapp.service.CartItemService;
import com.bookatable.reservationapp.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantDashboardController {

    private final ReservationService reservationService;
    private final CartItemService cartItemService;

    public RestaurantDashboardController(ReservationService reservationService, CartItemService cartItemService) {
        this.reservationService = reservationService;
        this.cartItemService = cartItemService;
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
        return ResponseEntity.ok(cartItemService.getOrdersForDate(restaurantId, localDate));
    }




}
